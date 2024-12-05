import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { Routes } from '@potentiel-applications/routes';
import { getLogger } from '@potentiel-libraries/monitoring';
import { getLogoutUrl } from '@potentiel-applications/request-context';

/**
 * This route manages logout from the SSO (keycloak).
 * Without this, logging out of the app only removes cookies, but the user is still logged to SSO
 * @see https://github.com/nextauthjs/next-auth/discussions/3938
 */
export const GET = async () => {
  const { BASE_URL = '' } = process.env;
  const redirectUrl = new URL(Routes.Auth.signOut(), BASE_URL);
  const logger = getLogger('Ssr.api.federatedLogout.route.get');

  try {
    // Gets the session, with idToken
    const session = await getServerSession({
      callbacks: {
        session({ session, token }) {
          session.idToken = token.idToken;
          return session;
        },
      },
    });
    if (!session) {
      return NextResponse.redirect(BASE_URL);
    }

    // after keycloak logout, redirect the user to this route to remove the session
    if (session.idToken) {
      const ssoLogoutUrl = await getLogoutUrl({
        id_token_hint: session.idToken,
        post_logout_redirect_uri: redirectUrl.toString(),
      });
      return NextResponse.redirect(ssoLogoutUrl.toString());
    }

    logger.warn('A user logged out without an id token, the keycloak session is still active');
    return NextResponse.redirect(redirectUrl);
  } catch (e) {
    logger.error(new Error('Logout error', { cause: e }));
    return NextResponse.redirect(redirectUrl);
  }
};

// forces the route handler to be dynamic
export const dynamic = 'force-dynamic';
