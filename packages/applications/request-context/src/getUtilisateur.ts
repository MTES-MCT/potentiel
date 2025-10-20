import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';

import { z } from 'zod';
import { mediator } from 'mediateur';
import { jwtVerify } from 'jose';
import { getServerSession } from 'next-auth';

import { Role, Utilisateur, TrouverUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Email } from '@potentiel-domain/common';
import { mapToPlainObject, OperationRejectedError, PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { authOptions } from './authOptions';
import { getJwks } from './openid';
import { getProviderAccountUrl } from './getProviderConfiguration';

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
      accountUrl: getProviderAccountUrl(provider ?? ''),
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
  const groupeRegex = /\/(?<type>GestionnairesRéseau)\/(?<nom>[\p{L}0-9\-\s]+$)$/u;

  return {
    role: Role.convertirEnValueType(role ?? ''),
    nom,
    identifiantUtilisateur: Email.convertirEnValueType(email),
    région: Option.none,
    zone: Option.none,
    identifiantGestionnaireRéseau:
      groupes?.[0] && groupeRegex.test(groupes[0])
        ? groupes[0].match(groupeRegex)!.groups!.nom
        : Option.none,
  };
};

export type GetUtilisateurFromEmail = (email: string) => Promise<
  Option.Type<
    PlainType<
      Utilisateur.ValueType & {
        désactivé?: true;
      }
    >
  >
>;

export const getUtilisateurFromEmail: GetUtilisateurFromEmail = async (email) => {
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
    nom: '',
    identifiantUtilisateur: Email.convertirEnValueType(email),
    identifiantGestionnaireRéseau: utilisateur.identifiantGestionnaireRéseau,
    région: utilisateur.région,
    zone: utilisateur.zone,
    désactivé: utilisateur.désactivé,
  };
};

/**
 * Returns the logged-in user, formatted for session.
 * If the user does not exist, a default role (porteur) is assigned
 **/
export const getSessionUtilisateurFromEmail = async (
  email: string,
  name?: string,
): Promise<PlainType<Utilisateur.ValueType>> => {
  const utilisateur = await getUtilisateurFromEmail(email);
  if (Option.isSome(utilisateur)) {
    if (utilisateur.désactivé) {
      throw new OperationRejectedError(`Forbidden`);
    }
    return {
      ...mapToPlainObject(utilisateur),
      nom: name ?? utilisateur.nom,
    };
  }

  return {
    role: Role.porteur,
    identifiantUtilisateur: Email.convertirEnValueType(email),
    nom: '',
    région: Option.none,
    zone: Option.none,
    identifiantGestionnaireRéseau: Option.none,
  };
};
