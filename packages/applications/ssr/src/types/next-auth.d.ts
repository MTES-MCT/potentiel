import { Utilisateur } from '@potentiel-domain/utilisateur';
import { PlainType } from '@potentiel-domain/core';

declare module 'next-auth/jwt' {
  interface JWT {
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
