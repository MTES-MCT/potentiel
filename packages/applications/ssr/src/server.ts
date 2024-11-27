import { createServer } from 'http';
import { parse } from 'url';

import next from 'next';

import { bootstrap, permissionMiddleware } from '@potentiel-applications/bootstrap';
import { runWithContext } from '@potentiel-applications/request-context';

/**
 * This is the entrypoint to the DEV mode of the SSR app.
 * For the entrypoint of the production mode, see the `legacy` application
 */
async function main() {
  const port = parseInt(process.env.PORT || '3000', 10);
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });

  const handle = app.getRequestHandler();
  await app.prepare();

  await bootstrap({ middlewares: [permissionMiddleware] });
  const server = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);

    await runWithContext({
      req,
      res,
      callback: () => handle(req, res, parsedUrl),
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
