import Handlebars from 'handlebars';

import { type TemplateDefinitions, templates } from './emails/index.js';
import { registerHelpers } from './helpers/registerHelpers.js';

registerHelpers();

/**
 * Render a template by name with the given data
 */
export function render({ key, values }: TemplateDefinitions) {
  const spec = templates[key];
  if (!spec) {
    throw new Error(
      `Template ${key} not found. Available templates: ${Object.keys(templates).join(', ')}`,
    );
  }

  // Render the body
  const bodyTemplate = Handlebars.template(spec.body);
  const html = bodyTemplate(values);

  // Render the subject if it exists
  let subject: string | undefined;
  if (spec.subject) {
    const subjectTemplate = Handlebars.template(spec.subject);
    subject = subjectTemplate(values);
  }

  return { html, subject };
}
