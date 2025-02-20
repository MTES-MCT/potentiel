import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';

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
  session: {
    strategy: 'jwt',
    // This is the max age for the next-auth cookie
    // It is renewed on each page refresh, so this represents inactivity time.
    // Moreover, the user will not be disconnected after expiration (if their Keycloak session still exists),
    // but there will be a redirection to keycloak.
    maxAge: parseInt(process.env.SESSION_MAX_AGE ?? String(OneHourInSeconds)),
  },
  events: {
    signIn: async ({
      user: {
        identifiantUtilisateur: { email },
      },
    }) => {
      await ajouterStatistiqueConnexion(email ?? '');
    },
  },
  callbacks: {
    signIn({ account, user }) {
      if (account?.provider === 'proconnect' && !canConnectWithProConnect(user.role)) {
        getLogger('Auth').info(`User try to connect with ProConnect but is not authorized yet`, {
          user,
        });

        return Routes.Auth.signIn({ proConnectNotAvailableForUser: true });
      }

      return true;
    },
    jwt({ token, trigger, account, user }) {
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
