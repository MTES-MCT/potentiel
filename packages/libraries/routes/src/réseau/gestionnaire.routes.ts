export const lister = '/reseaux/gestionnaires';

export const détail = (identifiantGestionnaireRéseau: string) =>
  `/reseaux/gestionnaires/${encodeURIComponent(identifiantGestionnaireRéseau)}`;

export const ajouter = '/reseaux/gestionnaires/ajouter';
