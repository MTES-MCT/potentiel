import { Pool } from 'pg';
import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import EmailProvider from 'next-auth/providers/email';

import { PostgresAdapter } from '@potentiel-libraries/auth-pg-adapter';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantUtilisateur, Role } from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';

import { getProviderConfiguration } from './getProviderConfiguration';
import { refreshToken } from './refreshToken';
import ProConnectProvider from './ProConnectProvider';
import { ajouterStatistiqueConnexion } from './ajouterStatistiqueConnexion';
import { getUtilisateurFromAccessToken, getUtilisateurFromEmail } from './getUtilisateur';
import { canConnectWithProConnect } from './canConnectWithProConnect';
import { canConnectWithMagicLink } from './canConnectWithMagicLink';

const OneHourInSeconds = 60 * 60;

const pool = new Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  options: '-c search_path=auth',
});

const fifteenMinutesInSeconds = 15 * 60;

export const authOptions: AuthOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    KeycloakProvider({
      ...getProviderConfiguration('keycloak'),
      profile: async (profile, tokens) => {
        const utilisateur = await getUtilisateurFromAccessToken(tokens.access_token ?? '');

        return {
          id: profile.sub,
          ...utilisateur,
        };
      },
    }),
    ProConnectProvider(getProviderConfiguration('proconnect')),
    EmailProvider({
      server: {
        host: process.env.NEXTAUTH_MAGICLINK_SERVER_HOST,
        port: process.env.NEXTAUTH_MAGICLINK_SERVER_PORT,
        auth: {
          user: process.env.NEXTAUTH_MAGICLINK_USERNAME,
          pass: process.env.NEXTAUTH_MAGICLINK_PASSWORD,
        },
      },
      from: process.env.SEND_EMAILS_FROM,
      maxAge: fifteenMinutesInSeconds,
    }),
  ],
  pages: {
    signIn: Routes.Auth.signIn(),
    error: Routes.Auth.unauthorized(),
    signOut: Routes.Auth.signOut(),
    verifyRequest: Routes.Auth.verifyRequest(),
  },
  session: {
    strategy: 'jwt',
    // This is the max age for the next-auth cookie
    // It is renewed on each page refresh, so this represents inactivity time.
    // Moreover, the user will not be disconnected after expiration (if their Keycloak session still exists),
    // but there will be a redirection to keycloak.
    maxAge: parseInt(process.env.SESSION_MAX_AGE ?? String(OneHourInSeconds)),
  },
  events: {
    signIn: ({ user, account }) => {
      if (
        user?.utilisateur?.identifiantUtilisateur &&
        !IdentifiantUtilisateur.bind(user.utilisateur.identifiantUtilisateur).estInconnu()
      ) {
        ajouterStatistiqueConnexion(user.utilisateur, account?.provider ?? '');
      }
    },
  },
  callbacks: {
    async signIn(args) {
      const { account, user } = args;

      const logger = getLogger('Auth');

      if (account?.provider === 'email') {
        const utilisateur = await getUtilisateurFromEmail(user.email ?? '');

        if (Option.isNone(utilisateur)) {
          return Routes.Auth.signIn({ error: 'Unauthorized' });
        }

        if (!canConnectWithMagicLink(utilisateur.role)) {
          getLogger('Auth').info(`User tries to connect with Magic Link but is not authorized`, {
            utilisateur,
          });
          return Routes.Auth.signIn({ error: 'Unauthorized' });
        }
      }

      if (
        user?.utilisateur?.identifiantUtilisateur &&
        IdentifiantUtilisateur.bind(user.utilisateur.identifiantUtilisateur).estInconnu()
      ) {
        logger.info(`User tries to connect with ProConnect but is not registered yet`, {
          user,
        });
        return Routes.Auth.signOut({
          proConnectNotAvailableForUser: true,
          idToken: account?.id_token,
        });
      }

      if (
        account?.provider === 'proconnect' &&
        user.utilisateur &&
        !canConnectWithProConnect(user.utilisateur.role)
      ) {
        logger.info(`User tries to connect with ProConnect but is not authorized yet`, {
          user,
        });

        return Routes.Auth.signOut({
          proConnectNotAvailableForUser: true,
          idToken: account?.id_token,
        });
      }

      return true;
    },
    async jwt(args) {
      const { token, trigger, account, user } = args;

      if (
        user?.utilisateur?.identifiantUtilisateur &&
        IdentifiantUtilisateur.bind(user.utilisateur.identifiantUtilisateur).estInconnu()
      ) {
        return {};
      }
      if (trigger === 'signIn' && account && user) {
        const { sub, expires_at = 0, provider } = account;
        const expiresAtInMs = expires_at * 1000;

        getLogger('Auth').debug(`User logged in`, { sub, expiresAt: new Date(expiresAtInMs) });

        if (provider === 'email') {
          const utilisateur = await getUtilisateurFromEmail(user.email ?? '');

          if (Option.isNone(utilisateur)) {
            return {
              ...token,
              provider,
              idToken: account.id_token,
              expiresAt: expiresAtInMs,
              refreshToken: account.refresh_token,
              utilisateur: {
                id: Option.none.type,
                nom: '',
                groupe: Option.none,
                role: Role.porteur,
                identifiantUtilisateur: IdentifiantUtilisateur.unknownUser,
              },
            };
          }

          return {
            ...token,
            provider,
            idToken: account.id_token,
            expiresAt: expiresAtInMs,
            refreshToken: account.refresh_token,
            utilisateur: {
              id: user.id,
              ...mapToPlainObject(utilisateur),
            },
          };
        }

        return {
          ...token,
          provider,
          idToken: account.id_token,
          expiresAt: expiresAtInMs,
          refreshToken: account.refresh_token,
          utilisateur: user,
        };
      }

      if (token.provider !== 'email') {
        const refreshedToken = await refreshToken(token);
        return { ...refreshedToken, utilisateur: token.utilisateur };
      }

      return { ...token, utilisateur: token.utilisateur };
    },
    session({ session, token }) {
      {
        if (token.utilisateur) {
          session.utilisateur = token.utilisateur;
        }

        if (token.provider) {
          session.provider = token.provider;
        }

        return session;
      }
    },
  },
};
