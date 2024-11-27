import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';

import { getServerSession } from 'next-auth';

import { Utilisateur } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { authOptions } from './authOptions';
import { convertToken } from './convertToken';

const parseRequest = (req: IncomingMessage) => {
  const { query } = parse(req.url!, true);
  const cookieHeader = req.headers.cookie ?? '';
  const cookies: Record<string, string> = Object.fromEntries(
    cookieHeader.split(';').map((v) => v.trim().split('=').map(decodeURIComponent)),
  );

  const reqWithCookies = Object.assign(req, { cookies, query });
  return reqWithCookies;
};

export async function getUtilisateur(req: IncomingMessage, res: ServerResponse) {
  try {
    const session = await getServerSession(parseRequest(req), res, authOptions);
    if (session?.utilisateur) {
      return Utilisateur.bind(session?.utilisateur);
    }
    const authHeader = req.headers.authorization ?? '';
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      const utilisateur = convertToken(authHeader.slice('bearer '.length));
      return Utilisateur.bind(utilisateur);
    }
  } catch (e) {
    const error = e as Error;
    getLogger('getUtilisateur').warn(`Auth failed: ${error}`);
  }
}
