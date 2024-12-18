import { Utilisateur } from '@potentiel-domain/utilisateur';
import { PlainType } from '@potentiel-domain/core';

// This is the content of the cookie stored by next-auth
export interface PotentielJWT {
  idToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  utilisateur?: PlainType<Utilisateur.ValueType>;
}

// This is the content of the session, as returned by getServerSession or useSession
export interface PotentielSession {
  idToken?: string;
  utilisateur?: PlainType<Utilisateur.ValueType>;
}

declare module 'next-auth/jwt' {
  interface JWT extends PotentielJWT {}
}

declare module 'next-auth' {
  interface Session extends PotentielSession {}
}
