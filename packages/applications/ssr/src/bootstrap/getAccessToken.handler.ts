import { Message, MessageHandler } from 'mediateur';
import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export type GetAccessTokenMessage = Message<'GET_ACCESS_TOKEN', {}, string>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

export const getAccessTokenHandler: MessageHandler<GetAccessTokenMessage> = async () => {
  const cookiesContent = cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  return decoded?.accessToken ?? '';
};
