import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

import { getLogger } from '@potentiel-libraries/monitoring';

import { convertToken } from './convertToken';

const ONE_HOUR = 60 * 60;

export const issuerUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`;

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_USER_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '',
      issuer: issuerUrl,
    }),
  ],
  session: {
    strategy: 'jwt',
    // This is the max age for the next-auth cookie
    // It is renewed on each page refresh, so this represents inactivity time.
    // Moreover, the user will not be disconnected after expiration (if their Keycloak session still exists),
    // but there will be a redirection to keycloak.
    maxAge: ONE_HOUR,
  },
  callbacks: {
    // Stores user data and idToken to the next-auth cookie
    jwt({ token, account }) {
      // NB `account` is defined only at login
      if (account?.access_token) {
        try {
          const utilisateur = convertToken(account.access_token);
          token.utilisateur = utilisateur;
        } catch (e) {
          getLogger('Auth').error(
            new Error("Impossible de convertir l'accessToken en Utilisateur", { cause: e }),
          );
          return token;
        }
      }
      // Stores the id token as it is required to logout of Keycloak
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
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
