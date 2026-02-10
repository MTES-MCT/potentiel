import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

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
  utilisateur?: PotentielUtilisateur;
  provider?: string;
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface JWT extends PotentielJWT {}
}

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Session extends PotentielSession {}

  export interface Profile {
    job?: string;
    given_name?: string;
    usual_name?: string;
  }
}
