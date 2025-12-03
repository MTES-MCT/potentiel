import { readFile } from 'fs/promises';
import { join } from 'path';

import { openApiDocument } from './generated/http/openapi3.js';

export const getOpenApiSpecs = async () => {
  const openApiSpecs = await readFile(join(__dirname, '@typespec/openapi3/openapi.json'), {
    encoding: 'utf-8',
  });
  return JSON.parse(openApiSpecs);
};

export { createPotentielApiRouter, PotentielApiRouter } from './generated/http/router.js';
export { HttpContext, Policy } from './generated/helpers/router.js';
export * from './generated/models/all/index.js';
export * from './generated/models/all/potentiel-api.js';

export const schemas = openApiDocument.components.schemas;
