import { Message, MessageHandler } from 'mediateur';
import { cookies, headers } from 'next/headers';
import { decode } from 'next-auth/jwt';
// import * as Sentry from '@sentry/nextjs';

import { Utilisateur } from '@potentiel-domain/utilisateur';

export type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  Utilisateur.ValueType
>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

/**
 * Check for an access token
 *  - in the session (encrypted)
 *  - in Authorization header
 **/
const getAccessToken = async () => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';
  if (sessionToken) {
    const decoded = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET ?? '',
    });

    return decoded?.accessToken;
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
