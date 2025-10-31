import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';

import { z } from 'zod';
import { mediator } from 'mediateur';
import { jwtVerify } from 'jose';
import { getServerSession } from 'next-auth';

import {
  Role,
  Utilisateur,
  TrouverUtilisateurQuery,
  TrouverUtilisateurReadModel,
} from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { authOptions } from './authOptions';
import { getJwks } from './openid';
import { getProviderAccountUrl } from './getProviderConfiguration';
import { PotentielUtilisateur } from './types';

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
    const utilisateur = Utilisateur.bind(session.utilisateur);
    const provider = session.provider;

    return {
      ...utilisateur,
      accountUrl: provider ? getProviderAccountUrl(provider) : undefined,
      nom: session.utilisateur.nom,
    };
  }
}

// API clients are authenticated by Authorization header
async function getApiUser(req: IncomingMessage) {
  const authHeader = req.headers.authorization ?? '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const accessToken = authHeader.slice('bearer '.length);
    const utilisateur = await getUtilisateurFromAccessToken(accessToken);
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
      const apiUser = await getApiUser(req);
      if (apiUser) {
        return { ...apiUser, accountUrl: '' };
      }
    }
  } catch (e) {
    const error = e as Error;
    getLogger('getUtilisateur').warn(`Auth failed: ${error}`);
  }
}

export const getUtilisateurFromAccessToken = async (
  accessToken: string,
): Promise<Utilisateur.ValueType> => {
  const jwtSchema = z.object({
    email: z.string(),
  });

  const jwks = await getJwks('keycloak');
  const { payload } = await jwtVerify(accessToken, jwks);
  const { email } = jwtSchema.parse(payload);
  const utilisateur = await getUtilisateurFromEmail(email);
  if (Option.isNone(utilisateur)) {
    getLogger('getUtilisateurFromAccessToken').warn('Utilisateur non trouvé', {
      email,
      iss: payload.iss,
    });
    throw new OperationRejectedError(`Forbidden`);
  }
  return utilisateur;
};

export type GetUtilisateurFromEmail = (
  email: string,
) => Promise<Option.Type<TrouverUtilisateurReadModel>>;

export const getUtilisateurFromEmail: GetUtilisateurFromEmail = async (email) => {
  return await mediator.send<TrouverUtilisateurQuery>({
    type: 'System.Utilisateur.Query.TrouverUtilisateur',
    data: {
      identifiantUtilisateur: email,
    },
  });
};

/**
 * Returns the logged-in user, formatted for session.
 * If the user does not exist, a default role (porteur) is assigned
 **/
export const getSessionUtilisateurFromEmail = async (
  email: string,
  nom?: string,
): Promise<PotentielUtilisateur> => {
  const utilisateur = await getUtilisateurFromEmail(email);
  if (Option.isSome(utilisateur)) {
    if (utilisateur.désactivé) {
      throw new OperationRejectedError(`Forbidden`);
    }
    return {
      ...utilisateur,
      nom,
    };
  }

  return {
    ...Utilisateur.convertirEnValueType({ rôle: Role.porteur.nom, identifiantUtilisateur: email }),
    nom,
  };
};
