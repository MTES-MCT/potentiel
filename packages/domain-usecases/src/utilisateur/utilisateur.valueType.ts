export type RawIdentifiantUtilisateur = string;

export type IdentifiantUtilisateurValueType = {
  email: string;
  formatter: () => RawIdentifiantUtilisateur;
};

export const convertirEnIdentifiantUtilisateur = (
  email: string,
): IdentifiantUtilisateurValueType => {
  return {
    email,
    formatter() {
      return this.email;
    },
  };
};

export type RôleUtilisateur =
  | 'admin'
  | 'porteur-projet'
  | 'dreal'
  | 'acheteur-obligé'
  | 'ademe'
  | 'dgec-validateur'
  | 'cre'
  | 'caisse-des-dépôts';
