import { openApiDocument } from './generated/http/openapi3.js';

export const getOpenApiSpecs = (baseUrl: string) => {
  const server = openApiDocument.servers[0];

  return {
    ...openApiDocument,
    servers: [
      {
        ...server,
        url: new URL(new URL(server.url).pathname, baseUrl).toString(),
      },
    ],
  };
};
export { createPotentielApiRouter, PotentielApiRouter } from './generated/http/router.js';
export { HttpContext, Policy } from './generated/helpers/router.js';
export * from './generated/models/all/index.js';
export * from './generated/models/all/potentiel-api.js';

export const schemas = openApiDocument.components.schemas;
