import http from 'node:http';

import { createPotentielApiRouter } from '@potentiel-applications/api-documentation';
import { getLogger } from '@potentiel-libraries/monitoring';

import { raccordementHandlers } from './handlers/raccordement/index.js';
import { handleError } from './errors.js';
import { achevementHandlers } from './handlers/achevement/index.js';

export const createApiServer = (basePath: string) => {
  const router = createPotentielApiRouter(raccordementHandlers, achevementHandlers, {
    basePath,
    onInternalError: ({ request, response }, error) => {
      const { statusCode, message } = handleError(error);
      if (statusCode === 500) {
        getLogger().error(message, { error, url: request.url });
      } else {
        getLogger().warn(message, { error, url: request.url });
      }
      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ code: statusCode, error: message }));
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
