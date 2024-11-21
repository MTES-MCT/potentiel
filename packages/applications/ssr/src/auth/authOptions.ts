import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { getLogger } from '@potentiel-libraries/monitoring';

import { convertToken } from './convertToken';

const ONE_HOUR = 60 * 60;

export const issuerUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`;

const clientId = process.env.KEYCLOAK_USER_CLIENT_ID ?? '';
const clientSecret = process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(refreshToken: string) {
  const url = new URL(`${issuerUrl}/protocol/openid-connect/token`);
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  const response = await fetch(url.toString(), {
    body: body.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });

  const refreshedTokens = await response.json();
  // console.log(refreshedTokens);

  if (!response.ok) {
    throw refreshedTokens;
  }

  return {
    accessToken: refreshedTokens.access_token,
    expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    refreshToken: refreshedTokens.refresh_token ?? refreshToken, // Fall back to old refresh token
  };
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      issuer: issuerUrl,
      clientId,
      clientSecret,
    }),
  ],
  session: {
    strategy: 'jwt',
    // This is the max age for the next-auth cookie
    // It is renewed on each page refresh, so this represents inactivity time.
    // Moreover, the user will not be disconnected after expiration (if their Keycloak session still exists),
    // but there will be a redirection to keycloak.
    maxAge: parseInt(process.env.SESSION_MAX_AGE ?? String(ONE_HOUR), 10),
    // maxAge: 10,
  },
  callbacks: {
    // Stores user data and idToken to the next-auth cookie
    async jwt({ token, account }) {
      const logger = getLogger('Auth');
      logger.debug('JWT callback', { expiresAt: token.expiresAt && new Date(token.expiresAt) });

      // Stores the id token as it is required to logout of Keycloak
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      // NB `account` is defined only at login
      if (account?.access_token) {
        logger.debug(`User log in`, { sub: token.sub });
        token.expiresAt = (account.expires_at ?? 0) * 1000;
        token.refreshToken = account.refresh_token;
        try {
          const utilisateur = convertToken(account.access_token);
          token.utilisateur = utilisateur;
        } catch (e) {
          logger.error(
            new Error("Impossible de convertir l'accessToken en Utilisateur", { cause: e }),
          );
        }
        return token;
      }

      // return {};

      if (token.expiresAt && Date.now() < token.expiresAt) {
        logger.debug('not expired');
        return token;
      }
      logger.debug(`Token expired`, { sub: token.sub });
      if (!token.refreshToken) {
        logger.warn(`no refreshToken available`, { sub: token.sub });
        return {};
      }
      try {
        const { accessToken, expiresAt, refreshToken } = await refreshAccessToken(
          token.refreshToken,
        );
        logger.debug(`Token refreshed`, { sub: token.sub, expiresAt: new Date(expiresAt) });
        token.expiresAt = expiresAt;
        token.refreshToken = refreshToken;
        const utilisateur = convertToken(accessToken);
        token.utilisateur = utilisateur;
        return token;
      } catch (e) {
        logger.error(new Error('Failed to refresh token', { cause: e }));
        return {};
      }
    },
    session({ session, token }) {
      {
        if (token.utilisateur) {
          session.utilisateur = token.utilisateur;
        }
        return session;
      }
    },
  },
};
