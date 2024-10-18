import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const FIFTEEN_MINUTES = 15 * 60;
const ONE_DAY = 24 * 60 * 60;

export const issuerUrl = `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`;

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_USER_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '',
      issuer: issuerUrl,
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: ONE_DAY,
    updateAge: FIFTEEN_MINUTES,
  },
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },
  },
};
