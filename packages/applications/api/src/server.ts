import http from 'node:http';

import { createPotentielApiRouter, HttpContext } from '@potentiel-applications/api-documentation';
import { getLogger } from '@potentiel-libraries/monitoring';

import { raccordementHandlers } from './handlers/raccordement/index.js';
import { handleError } from './errors.js';
import { achevementHandlers } from './handlers/achevement/index.js';

export const writeErrorResponse = (
  { response, request }: HttpContext,
  statusCode: number,
  error: string,
  body?: Record<string, unknown>,
) => {
  if (statusCode === 500) {
    getLogger().error(error, { error, url: request.url, body });
  } else {
    getLogger().warn(error, { error, url: request.url, body });
  }
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ code: statusCode, error, ...body }));
};

export const createApiServer = (basePath: string) => {
  const router = createPotentielApiRouter(raccordementHandlers, achevementHandlers, {
    basePath,
    onInternalError: (ctx, error) => {
      const { statusCode, message } = handleError(error);
      writeErrorResponse(ctx, statusCode, message);
    },
    onInvalidRequest: (ctx, errors) => writeErrorResponse(ctx, 400, 'Bad Request', { errors }),
    onRequestNotFound: (ctx) => writeErrorResponse(ctx, 404, 'Not Found'),
  });
  return (request: http.IncomingMessage, response: http.ServerResponse) => {
    // Hack because `basePath` is not used by the router to strip the path
    if (request.url) {
      request.url = request.url.replace(basePath, '');
    }
    router.dispatch(request, response);
  };
};
