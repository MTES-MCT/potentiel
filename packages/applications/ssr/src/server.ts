import { createServer } from 'http';
import { parse } from 'url';

import next from 'next';
import * as Sentry from '@sentry/nextjs';

import { bootstrap, logMiddleware, permissionMiddleware } from '@potentiel-applications/bootstrap';
import { getContext, runWebWithContext } from '@potentiel-applications/request-context';
import { createApiServer } from '@potentiel-applications/api';

import { setupLogger } from './setupLogger';
/**
 * This is the entrypoint to the DEV mode of the SSR app.
 * For the entrypoint of the production mode, see the `legacy` application
 */
async function main() {
  setupLogger();
  const port = parseInt(process.env.PORT || '3000', 10);
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });

  const nextHandler = app.getRequestHandler();
  await app.prepare();

  await bootstrap({ middlewares: [logMiddleware, permissionMiddleware] });

  // remove bootstrap messages from sentry's breadcrumbs
  Sentry.getCurrentScope().clearBreadcrumbs();

  const apiHandler = createApiServer('/api/v1');
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    if (parsedUrl.pathname?.startsWith('/api/v1')) {
      return await runWebWithContext({
        app: 'api',
        req,
        res,
        callback: () => apiHandler(req, res),
      });
    }

    await runWebWithContext({
      app: 'web',
      req,
      res,
      callback: () =>
        Sentry.withScope((scope) => {
          const utilisateur = getContext()?.utilisateur;
          if (utilisateur) {
            scope.setUser({ email: utilisateur.identifiantUtilisateur.email });
          }
          // Handle incoming HTTP request
          return nextHandler(req, res, parsedUrl);
        }),
    });
  });

  server.listen(port);
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  );
}

void main();
