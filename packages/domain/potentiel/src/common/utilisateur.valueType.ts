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
