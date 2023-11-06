import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const FIFTEEN_MINUTES = 15 * 60;
const ONE_DAY = 24 * 60 * 60;

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_USER_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '',
      issuer: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`,
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
      return token;
    },
  },
});

export { handler as GET, handler as POST };
