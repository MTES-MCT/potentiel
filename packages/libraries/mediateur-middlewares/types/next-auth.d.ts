import NextAuthJwt from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJwt.JWT {
    accessToken?: string;
  }
}
