import { createHmac } from 'crypto';

export type RawIdentifiantUtilisateur = string;

export type IdentifiantUtilisateurValueType = {
  email: string;
  hash: () => RawIdentifiantUtilisateur;
};

export const convertirEnIdentifiantUtilisateur = (
  email: string,
): IdentifiantUtilisateurValueType => {
  return {
    email,
    hash() {
      return createHmac('sha256', 'USERS_IDENTITY_SECRET')
        .update(this.email, 'utf-8')
        .digest('base64');
    },
  };
};
