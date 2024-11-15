import NextAuthJwt from 'next-auth/jwt';

import { Utilisateur } from '@potentiel-domain/utilisateur';

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJwt.JWT {
    idToken?: string;
    utilisateur?: PlainType<Utilisateur.ValueType>;
  }
}

declare module 'next-auth' {
  interface Session {
    idToken?: string;
    utilisateur?: PlainType<Utilisateur.ValueType>;
  }
}
