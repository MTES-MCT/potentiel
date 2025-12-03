import { readFile } from 'fs/promises';
import { join } from 'path';

export const getOpenApiSpecs = async () => {
  const openApiSpecs = await readFile(join(__dirname, '@typespec/openapi3/openapi.json'), {
    encoding: 'utf-8',
  });
  return JSON.parse(openApiSpecs);
};

export { createPotentielApiRouter, PotentielApiRouter } from './generated/http/router';
export { HttpContext } from './generated/helpers/router';
export * from './generated/models/all';
export * from './generated/models/all/potentiel-api';
