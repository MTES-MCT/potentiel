declare module 'next-auth/jwt' {
  interface JWT extends JWT {
    accessToken?: string;
  }
}
