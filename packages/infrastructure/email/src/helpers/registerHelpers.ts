import Handlebars from 'handlebars';

import { templates, type TemplateDefinitions } from './index.js';

export function renderHelper({ key, values }: TemplateDefinitions) {
  const spec = templates[key];
  if (!spec) {
    throw new Error(
      `Template ${key} not found. Available templates: ${Object.keys(templates).join(', ')}`,
    );
  }
  const template = Handlebars.template(spec.body);
  return template(values);
}

export const registerHelpers = () => {
  Handlebars.registerHelper('helperMissing', (options) => {
    throw new Error(`Missing helper argument ${options.name} in template`);
  });

  Handlebars.registerHelper('cta', (url: string, text: string, options) => {
    // Validate URL
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL provided in field "${options.name}": ${url}`);
    }
    return new Handlebars.SafeString(
      renderHelper({
        key: 'cta',
        values: {
          url: Handlebars.escapeExpression(url),
          text: Handlebars.escapeExpression(text),
        },
      }),
    );
  });
};
