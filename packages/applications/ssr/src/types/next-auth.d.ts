/* eslint-disable @typescript-eslint/no-empty-object-type */
import { PotentielJWT, PotentielSession } from '@potentiel-applications/request-context';

declare module 'next-auth/jwt' {
  interface JWT extends PotentielJWT {}
}

declare module 'next-auth' {
  interface Session extends PotentielSession {}
}
