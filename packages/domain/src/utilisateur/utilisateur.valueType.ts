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

export const utilisateurEstPorteur = (value: { rôle: any }): value is Utilisateur =>
  value.rôle === 'porteur-projet';
