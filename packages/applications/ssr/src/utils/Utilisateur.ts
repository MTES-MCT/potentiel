export type Utilisateur = {
  rôle:
    | 'admin'
    | 'porteur-projet'
    | 'dreal'
    | 'acheteur-obligé'
    | 'ademe'
    | 'dgec-validateur'
    | 'caisse-des-dépôts'
    | 'cre';
};
