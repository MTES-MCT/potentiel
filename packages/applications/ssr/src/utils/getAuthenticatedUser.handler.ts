import { Message, MessageHandler } from 'mediateur';
import { cookies, headers } from 'next/headers';
import { getToken, GetTokenParams } from 'next-auth/jwt';
// import * as Sentry from '@sentry/nextjs';

import { Utilisateur } from '@potentiel-domain/utilisateur';

export type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  Utilisateur.ValueType
>;

/**
 * Check for an access token
 *  - in the session (encrypted)
 *  - in Authorization header (clear)
 **/
const getAccessToken = async () => {
  const token = await getToken({
    req: {
      cookies: cookies(),
      // NB: getToken peut également récupérer le token dans le header Authorization
      // mais elle attend un token chiffré, ce qui n'est pas le cas dans le cadre de l'authentification API
      // headers: headers()
    } as unknown as GetTokenParams['req'],
  });
  if (token) {
    return token.accessToken;
  }
  const authorizationHeader = headers().get('authorization');
  return authorizationHeader?.replace(/Bearer /, '');
};

export const getOptionalAuthenticatedUser = async (): Promise<
  Utilisateur.ValueType | undefined
> => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    return Utilisateur.convertirEnValueType(accessToken);
  }
};

export const getAuthenticatedUser: MessageHandler<GetAuthenticatedUserMessage> = async () => {
  const user = await getOptionalAuthenticatedUser();

  if (!user) {
    // Sentry.setUser(null);
    throw new NoAuthenticatedUserError();
  }

  // Sentry user set up for server side errors
  // Sentry.setUser({
  //   email: user.identifiantUtilisateur.email,
  // });

  return user;
};

export class NoAuthenticatedUserError extends Error {
  constructor(cause?: Error) {
    super(`Authentification obligatoire`, { cause });
  }
}
