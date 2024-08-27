import { Message, MessageHandler } from 'mediateur';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
// import * as Sentry from '@sentry/nextjs';

import { Utilisateur } from '@potentiel-domain/utilisateur';

export type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  Utilisateur.ValueType
>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

export const getOptionalAuthenticatedUser = async (): Promise<
  Utilisateur.ValueType | undefined
> => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  if (!decoded?.accessToken) {
    return undefined;
  }

  return Utilisateur.convertirEnValueType(decoded.accessToken);
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
