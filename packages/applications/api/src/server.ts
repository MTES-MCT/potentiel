import http from 'node:http';

import { createPotentielApiRouter, HttpContext } from '@potentiel-applications/api-documentation';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getUtilisateur } from '#helpers';

import { raccordementHandlers } from './handlers/raccordement/index.js';
import { handleError } from './errors.js';
import { achevementHandlers } from './handlers/achevement/index.js';

export const writeErrorResponse = (
  { response, request }: Omit<HttpContext, 'errorHandlers'>,
  statusCode: number,
  error: string,
  body?: Record<string, unknown>,
) => {
  if (statusCode === 500) {
    getLogger('API').error(error, { error, url: request.url, body });
  } else {
    getLogger('API').warn(error, { error, url: request.url, body });
  }
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ code: statusCode, error, ...body }));
};

export const createApiServer = (basePath: string) => {
  const router = createPotentielApiRouter(raccordementHandlers, achevementHandlers, {
    basePath,
    onInternalError: (ctx, error) => {
      const { statusCode, message, body } = handleError(error);
      writeErrorResponse(ctx, statusCode, message, body);
    },
    onInvalidRequest: (ctx, route, errors) =>
      writeErrorResponse(ctx, 400, 'Bad Request', { route, errors }),
    onRequestNotFound: (ctx) => writeErrorResponse(ctx, 404, 'Not Found'),
  });
  return async (request: http.IncomingMessage, response: http.ServerResponse) => {
    try {
      getUtilisateur();
    } catch {
      writeErrorResponse({ request, response }, 401, 'Unauthorized');
      return;
    }

    if (request.url) {
      const url = new URL(request.url, `http://${request.headers.host}`);
      // Hack because `basePath` is not used by the router to strip the path
      url.pathname = url.pathname.replace(basePath, '');
      // strip trailing slash
      url.pathname = url.pathname.replace(/\/+$/, '');
      request.url = url.toString();
    }

    try {
      router.dispatch(request, response);
    } catch (e) {
      getLogger('API').error('Unhandled error in API server', { error: e, url: request.url });
      writeErrorResponse({ request, response }, 500, 'Internal Server Error', { error: e });
    }
  };
};
