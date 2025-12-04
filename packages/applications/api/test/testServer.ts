import http from 'node:http';

import { killPool } from '@potentiel-libraries/pg-helpers';
import { bootstrap } from '@potentiel-applications/bootstrap';
import { runWebWithContext } from '@potentiel-applications/request-context';

import { createApiServer } from '../src/server.js';

export type TestServer = {
  close: () => Promise<void>;
  rootUrl: string;
};
export const createTestServer = async (): Promise<TestServer> => {
  const port = Math.floor(10000 + Math.random() * 50000);

  process.env.KEYCLOAK_REALM = `Potentiel`;
  process.env.KEYCLOAK_SERVER = `http://localhost:8080`;
  process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel@localhost:5433/potentiel';
  process.env.NEXTAUTH_SECRET = 'abcd';
  process.env.NEXTAUTH_URL = `http://localhost:${port}`;

  await bootstrap({ middlewares: [] });
  const requestHandler = createApiServer('/api/v1');

  const server = http.createServer((req, res) =>
    runWebWithContext({
      req,
      res,
      callback: async () => {
        return requestHandler(req, res);
      },
      app: 'api',
    }),
  );
  await new Promise<void>((r) => server.listen(port, r));
  return {
    rootUrl: `http://localhost:${port}/api/v1`,
    async close() {
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      );
      await killPool();
    },
  };
};
