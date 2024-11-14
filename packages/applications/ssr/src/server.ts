import { createServer } from 'http';
import { parse } from 'url';

import { config } from 'dotenv';
import next from 'next';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

import { bootstrap } from '@potentiel-applications/bootstrap';
import { requestContextStorage } from '@potentiel-applications/request-context';
import { Utilisateur } from '@potentiel-domain/utilisateur';

async function main() {
  config();
  const port = parseInt(process.env.PORT || '3000', 10);
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });

  const handle = app.getRequestHandler();
  await app.prepare();

  await bootstrap({});
  const server = createServer(async (req, res) => {
    const correlationId = crypto.randomUUID();
    const parsedUrl = parse(req.url!, true);
    // at this stage we don't have access to next's cookies() so we have to parse cookies manually
    const cookieHeader = req.headers.cookie ?? '';
    const cookies = Object.fromEntries(cookieHeader.split(';').map((v) => v.trim().split('=')));
    const token = await getToken({ req: { cookies } as unknown as NextRequest });
    const utilisateur = token?.utilisateur && Utilisateur.bind(token.utilisateur);

    requestContextStorage.run({ correlationId, utilisateur }, async () => {
      handle(req, res, parsedUrl);
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
