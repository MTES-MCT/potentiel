import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const getOpenApiSpecs = async () => {
  const openApiSpecs = await readFile(join(__dirname, '@typespec/openapi3/openapi.json'), {
    encoding: 'utf-8',
  });
  return JSON.parse(openApiSpecs);
};
