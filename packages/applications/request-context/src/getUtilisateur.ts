import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';

import { z } from 'zod';
import { mediator } from 'mediateur';
import { jwtVerify } from 'jose';
import { getServerSession } from 'next-auth';

import { Groupe, Role, Utilisateur, TrouverUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { authOptions } from './authOptions';
import { getJwks } from './openid';

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
      return await getApiUser(req);
    }
  } catch (e) {
    const error = e as Error;
    getLogger('getUtilisateur').warn(`Auth failed: ${error}`);
  }
}

export const getUtilisateurFromAccessToken = async (
  accessToken: string,
): Promise<PlainType<Utilisateur.ValueType>> => {
  const jwtSchema = z.object({
    name: z.string().default(''),
    email: z.string(),
    realm_access: z.object({
      roles: z.array(z.string()),
    }),
    groups: z.array(z.string()).optional(),
  });

  const jwks = await getJwks('keycloak');
  const { payload } = await jwtVerify(accessToken, jwks);
  const {
    email,
    name: nom,
    realm_access: { roles },
    groups: groupes,
  } = jwtSchema.parse(payload);

  const role = roles.find((r) => Role.estUnRoleValide(r));
  const groupe = groupes?.find((g) => Groupe.estUnGroupeValide(g));

  return {
    role: Role.convertirEnValueType(role ?? ''),
    groupe: groupe ? Groupe.convertirEnValueType(groupe) : Option.none,
    nom,
    identifiantUtilisateur: Email.convertirEnValueType(email),
  };
};

export const getUtilisateurFromEmail = async (
  email: string,
): Promise<Option.Type<PlainType<Utilisateur.ValueType>>> => {
  const utilisateur = await mediator.send<TrouverUtilisateurQuery>({
    type: 'System.Utilisateur.Query.TrouverUtilisateur',
    data: {
      identifiantUtilisateur: email,
    },
  });

  if (Option.isNone(utilisateur)) {
    return utilisateur;
  }

  return {
    role: utilisateur.rôle,
    groupe: Option.none,
    nom: utilisateur.nomComplet,
    identifiantUtilisateur: Email.convertirEnValueType(email),
  };
};
