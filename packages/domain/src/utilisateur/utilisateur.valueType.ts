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

export type Utilisateur = { role: RôleUtilisateur };
