import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

import { authOptions, issuerUrl } from '@/auth';

/**
 * This route manages logout from the SSO (keycloak).
 * Without this, logging out of the app only removes session, but the user is still logged to SSO
 * @see https://github.com/nextauthjs/next-auth/discussions/3938
 */
export async function GET() {
  const { NEXTAUTH_URL = '', NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } =
    process.env;

  // Gets the session, with idToken
  const session = await getServerSession({
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      session({ session, token }) {
        session.idToken = token.idToken;
        return session;
      },
    },
  });
  if (!session) {
    return NextResponse.redirect(NEXTAUTH_URL);
  }

  // after keycloak logout, redirect the user to this route to remove the session
  const redirectUrl = new URL('/auth/signOut', NEXTAUTH_URL);
  const ssoLogoutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`);

  cookies().delete(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME);

  if (session.idToken) {
    // without this, Keycloak prompts the user for confirmation
    ssoLogoutUrl.searchParams.set('post_logout_redirect_uri', redirectUrl.toString());
    ssoLogoutUrl.searchParams.set('id_token_hint', session.idToken);
  }

  return NextResponse.redirect(ssoLogoutUrl);
}
