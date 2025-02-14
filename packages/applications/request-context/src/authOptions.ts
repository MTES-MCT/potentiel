import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { mediator, Message } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';

import {
  keycloakIssuerUrl,
  keycloakClientId,
  keycloakClientSecret,
  proConnectIssuerUrl,
  proConnectClientId,
  proConnectClientSecret,
} from './constants';
import { convertToken } from './convertToken';
import { refreshAccessToken } from './refreshToken';
import ProConnectProvider from './ProConnectProvider';
const ONE_HOUR_IN_SECONDS = 60 * 60;

type AjouterStatistique = Message<
  'System.Statistiques.AjouterStatistique',
  {
    type: 'connexionUtilisateur';
    données: {
      utilisateur: {
        role: Role.RawType;
      };
    };
  }
>;

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      issuer: keycloakIssuerUrl,
      clientId: keycloakClientId,
      clientSecret: keycloakClientSecret,
    }),
    ProConnectProvider({
      issuer: proConnectIssuerUrl,
      clientId: proConnectClientId,
      clientSecret: proConnectClientSecret,
    }),
  ],
  session: {
    strategy: 'jwt',
    // This is the max age for the next-auth cookie
    // It is renewed on each page refresh, so this represents inactivity time.
    // Moreover, the user will not be disconnected after expiration (if their Keycloak session still exists),
    // but there will be a redirection to keycloak.
    maxAge: parseInt(process.env.SESSION_MAX_AGE ?? String(ONE_HOUR_IN_SECONDS), 10),
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
          const utilisateur = await convertToken(account.access_token, account.provider);
          token.utilisateur = utilisateur;
        } catch (e) {
          logger.error(
            new Error("Impossible de convertir l'accessToken en Utilisateur", { cause: e }),
          );
        }

        try {
          await mediator.send<AjouterStatistique>({
            type: 'System.Statistiques.AjouterStatistique',
            data: {
              type: 'connexionUtilisateur',
              données: { utilisateur: { role: token.utilisateur!.role.nom } },
            },
          });
        } catch (e) {
          console.log(e);
          logger.error("Impossible d'ajouter les statistiques de connexion", { cause: e });
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
        const provider = account?.provider ?? 'proconnect';

        const { accessToken, expiresAt, refreshToken } = await refreshAccessToken(
          token.refreshToken,
          provider,
        );

        logger.debug(`Token refreshed`, { sub: token.sub, expiresAt: new Date(expiresAt) });

        token.expiresAt = expiresAt;
        token.refreshToken = refreshToken;

        const utilisateur = await convertToken(accessToken, provider);
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
