import NextAuthJwt from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJwt.JWT {
    idToken?: string;
    accessToken?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    idToken?: string;
    accessToken?: string;
  }
}
