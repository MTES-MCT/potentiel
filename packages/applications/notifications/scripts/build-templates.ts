#!/usr/bin/env node
// Build script:
// - wraps HTML in src/layouts/email.layout.html (must contain {{{body}}})
// - inlines CSS (juice)
// - precompiles the final HTML with Handlebars.precompile
// - writes ESM modules to dist/emails/<name>.js that export the precompiled template
// - creates dist/index.js with a render function that can render any template
// - creates src/emails/index.d.ts with typescript definitions
// - precompiles other emails found in src/emails/**/*.hbs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { sync as globSync } from 'glob';
import matter from 'gray-matter';
import Handlebars from 'handlebars';
import juice from 'juice';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDirRoot = path.join(__dirname, '../src/templates');
const outDirRoot = path.join(__dirname, '../dist/templates');
const layoutPath = path.join(__dirname, '../src/templates/layouts/email.layout.html');

type TemplateVariables = { [nom: string]: 'string' | TemplateVariables };

const getNom = (expression: hbs.AST.Expression) =>
  expression.type === 'PathExpression'
    ? (expression as hbs.AST.PathExpression).original
    : undefined;

const ajouterVariablesString = (acc: TemplateVariables, expressions: hbs.AST.Expression[]) => {
  for (const nom of expressions.map(getNom)) {
    if (nom) acc[nom] = 'string';
  }
  return acc;
};

const extractVariablesFromBody = (body: hbs.AST.Statement[]): TemplateVariables =>
  body.reduce<TemplateVariables>((acc, statement) => {
    if (statement.type === 'MustacheStatement') {
      const node = statement as hbs.AST.MustacheStatement;
      return ajouterVariablesString(acc, node.params.length > 0 ? node.params : [node.path]);
    }

    if (statement.type === 'BlockStatement') {
      const node = statement as hbs.AST.BlockStatement;
      const [collection] = node.params;
      const nomCollection = collection && getNom(collection);

      if (getNom(node.path) === 'each' && nomCollection) {
        acc[nomCollection] = extractVariablesFromBody(node.program.body);
        return acc;
      }

      return Object.assign(
        ajouterVariablesString(acc, node.params),
        extractVariablesFromBody(node.program.body),
      );
    }

    return acc;
  }, {});

const extractVariables = (template: string) =>
  extractVariablesFromBody(Handlebars.parse(template).body);

const typeTemplateVariables = (variables: TemplateVariables): string =>
  `{ ${Object.entries(variables)
    .map(
      ([nom, type]) =>
        `'${nom}': ${type === 'string' ? 'string' : `Array<${typeTemplateVariables(type)}>`}`,
    )
    .join('; ')} }`;

const extractTemplates = (name: string, layout?: string) => {
  const srcDir = path.join(srcDirRoot, name);
  const outDir = path.join(outDirRoot, name);

  const indexPath = path.join(outDir, 'index.js');
  const definitionPath = path.join(srcDir, 'index.d.ts');

  // Find templates
  const files = globSync('**/*.{hbs,md}', { cwd: srcDir, nodir: true });

  if (files.length === 0) {
    console.log('No templates found in', srcDir);
    process.exit(0);
  }

  const templates: { key: string; variables: TemplateVariables }[] = [];

  const md = new MarkdownIt({ html: true, linkify: true });
  const renderMarkdown = (input: string) => {
    const text = input.replaceAll(DYNAMIC_LINK_REGEX, '<a href="{{{$2}}}">$1</a>');
    return md.render(text);
  };

  // Match [text]({{url}}) and convert to <a href="{{url}}">text</a>
  const DYNAMIC_LINK_REGEX = /\[(.*)\]\(\{\{(.*)\}\}\)/g;
  for (const file of files) {
    const absPath = path.join(srcDir, file);
    const rawBody = fs.readFileSync(absPath, 'utf-8');

    // Parse frontmatter (YAML header) from markdown
    let frontmatter: Record<string, unknown> = {};
    let content = rawBody;

    if (file.endsWith('.md')) {
      const parsed = matter(rawBody);
      frontmatter = parsed.data;
      content = parsed.content;
    }
    // render markdown
    const bodyHtml = file.endsWith('.md') ? renderMarkdown(content) : content;

    const assembled = layout?.replace('{{{body}}}', bodyHtml) ?? bodyHtml;

    // Precompile with Handlebars. The precompiled output is JS source (object) that
    // Handlebars.runtime.template can turn into a template function.
    const precompiledSpec = Handlebars.precompile(assembled);

    // Also precompile the subject if it exists.
    // As it is plain text, we disable HTML escaping
    const subjectPrecompiled = frontmatter.subject
      ? Handlebars.precompile(frontmatter.subject, { noEscape: true })
      : null;

    const variables = {
      ...extractVariables(assembled),
      ...(frontmatter.subject ? extractVariables(frontmatter.subject as string) : {}),
    };

    // Write an ESM module that exports the precompiled template spec
    const templateName = file.replace(/\.(md|hbs)$/, '');

    // For email templates, export body and subject. For helpers, export just the template.
    const outSource = `// Auto-generated from ${file} - DO NOT EDIT
export default {
  body: ${precompiledSpec},
${subjectPrecompiled ? `  subject: ${subjectPrecompiled}` : ``}
};
`;

    const outPath = path.join(outDir, `${templateName}.js`);
    // Ensure output dir exists
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, outSource, 'utf-8');
    console.log('Wrote', outPath);

    templates.push({ key: templateName, variables });
  }

  // Generate index.js with render function
  const imports = templates
    .map(({ key }) => `import ${key.replace(/[^a-zA-Z0-9]/g, '_')} from './${key}.js';`)
    .join('\n');

  const templateMap = templates
    .map(({ key }) => `  '${key}': ${key.replace(/[^a-zA-Z0-9]/g, '_')}`)
    .join(',\n');

  const indexSource = `
// Auto-generated - DO NOT EDIT
${imports}

export const templates = {
${templateMap}
};
`;

  const definitionSource = `// Auto-generated - DO NOT EDIT
import type { TemplateSpecification } from 'handlebars';

type Template<Name extends string, Values> = {
  key: Name;
  values: Values;
};

export type TemplateDefinitions = 
${templates
  .map(({ key, variables }) => `  | Template<'${key}', ${typeTemplateVariables(variables)}>`)
  .join('\n')};

export type TemplateNames = TemplateDefinitions['key'];

export const templates: Record<
  TemplateNames,
  {
    body: TemplateSpecification;
    subject?: TemplateSpecification;
  }
>;
`;

  fs.writeFileSync(indexPath, indexSource, 'utf-8');
  console.log('Wrote', indexPath);
  fs.writeFileSync(definitionPath, definitionSource, 'utf-8');
  console.log('Wrote', definitionPath);
};

const main = () => {
  // Load layout
  if (!fs.existsSync(layoutPath)) {
    console.error('Missing layout at', layoutPath);
    process.exit(1);
  }
  const layoutRaw = fs.readFileSync(layoutPath, 'utf-8');

  // Insert body HTML into layout. Layout should expose {{{body}}} where the HTML goes.
  if (!layoutRaw.includes('{{{body}}}')) {
    console.error('Layout must include {{{body}}} placeholder:', layoutPath);
    process.exit(1);
  }

  // Inline CSS so produced HTML is ready for email clients
  const layout = juice(layoutRaw);

  extractTemplates('emails', layout);
  extractTemplates('helpers', undefined);
  console.log('Done precompiling templates.');
};

main();
