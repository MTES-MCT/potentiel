export const PermissionListerGestionnairesRéseau = {
  nom: 'lister-gestionnaires-réseau',
  description: 'Lister les gestionnaires de réseau',
};

export type GestionnaireRéseauReadModel = {
  id: string;
  nom: string;
};

export type ListerGestionnairesRéseau = () => Promise<Array<GestionnaireRéseauReadModel>>;
