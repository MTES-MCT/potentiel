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

// users are authenticated by cookie
async function getUserSession(req: IncomingMessage, res: ServerResponse) {
  const session = await getServerSession(parseRequest(req), res, authOptions);
  if (session?.utilisateur) {
    return Utilisateur.bind(session?.utilisateur);
  }
}

// API clients are authenticated by Authorization header
async function getApiUser(req: IncomingMessage) {
  const authHeader = req.headers.authorization ?? '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const utilisateur = await convertToken(authHeader.slice('bearer '.length));
    return Utilisateur.bind(utilisateur);
  }
}

/** Returns the logged-in user, if any */
export async function getUtilisateur(req: IncomingMessage, res: ServerResponse) {
  try {
    const user = await getUserSession(req, res);
    if (user) {
      return user;
    }
    if (req.url?.startsWith('/api')) {
      return await getApiUser(req);
    }
  } catch (e) {
    const error = e as Error;
    getLogger('getUtilisateur').warn(`Auth failed: ${error}`);
  }
}
