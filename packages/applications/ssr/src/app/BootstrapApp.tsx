import { Message, MessageHandler, mediator } from 'mediateur';
import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';

type GetAccessTokenMessage = Message<'GET_ACCESS_TOKEN', {}, string>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

class AuthenticationError extends Error {
  constructor() {
    super(`Vous devez être authentifié`);
  }
}

const handler: MessageHandler<GetAccessTokenMessage> = async () => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  if (!decoded?.accessToken) {
    throw new AuthenticationError();
  }

  return decoded.accessToken;
};

mediator.register('GET_ACCESS_TOKEN', handler);

export const BootstrapApp = () => {
  return null;
};
