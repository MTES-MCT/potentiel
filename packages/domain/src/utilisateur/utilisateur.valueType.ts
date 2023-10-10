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

const ROLES_UTILISATEURS = [
  'admin',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
  'dgec-validateur',
  'cre',
  'caisse-des-dépôts',
] as const;

export type RôleUtilisateur = (typeof ROLES_UTILISATEURS)[number];

export type Utilisateur = { rôle: RôleUtilisateur };

export const utilisateurEstPorteur = (value: { rôle: unknown }): value is Utilisateur =>
  value.rôle === 'porteur-projet';
