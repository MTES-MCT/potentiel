import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Message, MessageHandler } from 'mediateur';
import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export type GetAuthenticatedUserMessage = Message<
  'GET_AUTHENTICATED_USER',
  {},
  Utilisateur.ValueType
>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

export const getAuthenticatedUserHandler: MessageHandler<
  GetAuthenticatedUserMessage
> = async () => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  const utilisateur = Utilisateur.convertirEnValueType(decoded?.accessToken ?? '');
  return utilisateur;
};
