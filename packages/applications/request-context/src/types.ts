import { Utilisateur } from '@potentiel-domain/utilisateur';
import { PlainType } from '@potentiel-domain/core';

// This is the content of the cookie stored by next-auth
export interface PotentielJWT {
  idToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  provider?: string;
  job?: string;
}

// This is the content of the session, as returned by getServerSession or useSession
export interface PotentielSession {
  idToken?: string;
  utilisateur?: PlainType<Utilisateur.ValueType>;
  provider?: string;
}

declare module 'next-auth/jwt' {
  interface JWT extends PotentielJWT {}
}

declare module 'next-auth' {
  interface Session extends PotentielSession {}

  export interface Profile {
    job?: string;
    given_name?: string;
    usual_name?: string;
  }
}
