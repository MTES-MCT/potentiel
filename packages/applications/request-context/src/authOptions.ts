import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { getProviderConfiguration } from './getProviderConfiguration';
import { refreshToken } from './refreshToken';
import ProConnectProvider from './ProConnectProvider';
import { signIn } from './signIn';
import { ajouterStatistiqueConnexion } from './ajouterStatistiqueConnexion';

const OneHourInSeconds = 60 * 60;

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider(getProviderConfiguration('keycloak')),
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
    signIn: async ({ user: { email } }) => {
      await ajouterStatistiqueConnexion(email ?? '');
    },
  },
  callbacks: {
    // Stores user data and idToken to the next-auth cookie
    jwt({ token, account, trigger }) {
      if (trigger === 'signIn' && account) {
        return signIn({
          token,
          account,
        });
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
