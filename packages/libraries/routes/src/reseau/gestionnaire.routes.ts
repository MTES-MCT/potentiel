export const lister = '/reseau/gestionnaires';

export const détail = (identifiantGestionnaireRéseau: string) =>
  `/reseau/gestionnaires/${encodeURIComponent(identifiantGestionnaireRéseau)}`;

export const ajouter = '/reseau/gestionnaires/ajouter';
