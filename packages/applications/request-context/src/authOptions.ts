import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { getProviderConfiguration } from './getProviderConfiguration';
import { refreshToken } from './refreshToken';
import ProConnectProvider from './ProConnectProvider';
import { ajouterStatistiqueConnexion } from './ajouterStatistiqueConnexion';
import { getUtilisateurFromAccessToken } from './getUtilisateur';
import { canConnectWithProConnect } from './canConnectWithProConnect';

const OneHourInSeconds = 60 * 60;

export const authOptions: AuthOptions = {
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
  ],
  pages: {
    signIn: Routes.Auth.signIn(),
    error: Routes.Auth.unauthorized(),
    signOut: Routes.Auth.signOut(),
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
        user?.identifiantUtilisateur &&
        !IdentifiantUtilisateur.bind(user.identifiantUtilisateur).estInconnu()
      ) {
        ajouterStatistiqueConnexion(user, account?.provider ?? '');
      }
    },
  },
  callbacks: {
    signIn({ account, user }) {
      const logger = getLogger('Auth');
      if (
        user?.identifiantUtilisateur &&
        IdentifiantUtilisateur.bind(user.identifiantUtilisateur).estInconnu()
      ) {
        logger.info(`User tries to connect with ProConnect but is not registered yet`, {
          user,
        });
        return Routes.Auth.signOut({
          proConnectNotAvailableForUser: true,
          idToken: account?.id_token,
        });
      }
      if (account?.provider === 'proconnect' && !canConnectWithProConnect(user.role)) {
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
    jwt({ token, trigger, account, user }) {
      if (
        user?.identifiantUtilisateur &&
        IdentifiantUtilisateur.bind(user.identifiantUtilisateur).estInconnu()
      ) {
        return {};
      }
      if (trigger === 'signIn' && account && user) {
        const { sub, expires_at = 0, provider } = account;
        const expiresAtInMs = expires_at * 1000;

        getLogger('Auth').debug(`User logged in`, { sub, expiresAt: new Date(expiresAtInMs) });

        return {
          ...token,
          provider,
          idToken: account.id_token,
          expiresAt: expiresAtInMs,
          refreshToken: account.refresh_token,
          utilisateur: user,
        };
      }

      return refreshToken(token);
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
