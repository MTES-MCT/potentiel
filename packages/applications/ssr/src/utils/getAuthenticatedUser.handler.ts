import { Message, MessageHandler } from 'mediateur';
import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';

import { Utilisateur } from '@potentiel-domain/utilisateur';

export type GetAuthenticatedUserMessage = Message<
  'System.Authorization.RécupérerUtilisateur',
  {},
  Utilisateur.ValueType
>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

export const getAuthenticatedUser: MessageHandler<GetAuthenticatedUserMessage> = async () => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  if (!decoded?.accessToken) {
    throw new NoAuthenticatedUserError();
  }

  return Utilisateur.convertirEnValueType(decoded.accessToken);
};

export class NoAuthenticatedUserError extends Error {
  constructor(cause?: Error) {
    super(`Authentification obligatoire`, { cause });
  }
}
