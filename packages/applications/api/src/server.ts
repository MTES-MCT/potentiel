import http from 'node:http';

import { createPotentielApiRouter } from '@potentiel-applications/api-documentation';

import { raccordementHandlers } from './handlers/raccordement/index.js';
import { ApiError } from './errors.js';

export const createApiServer = (basePath: string) => {
  const router = createPotentielApiRouter(raccordementHandlers, {
    basePath,
    onInternalError: ({ response }, error) => {
      console.error('Internal server error:', error);
      response.setHeader('Content-Type', 'text/plain;charset=utf-8');
      if (error instanceof ApiError) {
        response.statusCode = error.code;
        response.end(error.message);
        return;
      }
      response.statusCode = 500;
      response.end('Internal server error');
    },
  });
  return (request: http.IncomingMessage, response: http.ServerResponse) => {
    // Hack because `basePath` is not used by the router to strip the path
    if (request.url) {
      request.url = request.url.replace(basePath, '');
    }
    router.dispatch(request, response);
  };
};
