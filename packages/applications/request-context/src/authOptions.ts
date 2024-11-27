import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { getLogger } from '@potentiel-libraries/monitoring';

import { issuerUrl, clientId, clientSecret } from './constants';
import { convertToken } from './convertToken';
import { refreshAccessToken } from './refreshToken';

const ONE_HOUR = 60 * 60;

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
      if (!account && !token.utilisateur) {
        return {};
      }
      const logger = getLogger('Auth');

      // Stores the id token as it is required to logout of Keycloak
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      // NB `account` is defined only at login
      if (account?.access_token) {
        token.expiresAt = (account.expires_at ?? 0) * 1000;
        token.refreshToken = account.refresh_token;
        logger.debug(`User logged in`, { sub: token.sub, expiresAt: new Date(token.expiresAt) });
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

      // nominal case, the token is up to date
      if (token.expiresAt && Date.now() < token.expiresAt) {
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
        const err = e as { error?: string; error_description?: string };
        if (err?.error === 'invalid_grant') {
          logger.warn(`Failed to refresh token (invalid_grant): ${err.error_description}`);
        } else {
          logger.error(new Error('Failed to refresh token', { cause: (e as Error).message }));
        }
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
