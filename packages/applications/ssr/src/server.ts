import { createServer } from 'http';
import { parse } from 'url';

import * as Sentry from '@sentry/nextjs';
import next from 'next';

import { createApiServer } from '@potentiel-applications/api';
import { bootstrap, logMiddleware, permissionMiddleware } from '@potentiel-applications/bootstrap';
import { runWebWithContext } from '@potentiel-applications/request-context';

import { getApiUser } from './auth/getApiUser';
import { getSessionUser } from './auth/getSessionUser';
import { setupLogger } from './setupLogger';
import { setCspHeader } from './utils/csp';

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
  const ignorePaths = ['/_next', '/illustrations', '/api/auth'];
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    setCspHeader(req, res);

    if (ignorePaths.some((p) => req.url?.startsWith(p))) {
      return nextHandler(req, res, parsedUrl);
    }

    if (parsedUrl.pathname?.startsWith('/api/v1')) {
      return await runWebWithContext({
        app: 'api',
        req,
        res,
        callback: apiHandler,
        getUtilisateur: getApiUser,
      });
    }

    await runWebWithContext({
      app: 'web',
      req,
      res,
      callback: (req, res) => nextHandler(req, res, parsedUrl),
      getUtilisateur: getSessionUser,
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
