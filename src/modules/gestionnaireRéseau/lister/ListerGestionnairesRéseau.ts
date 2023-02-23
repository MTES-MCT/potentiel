export const PermissionListerGestionnairesRéseau = {
  nom: 'lister-gestionnaires-réseau',
  description: 'Lister les gestionnaires de réseau',
};

type GestionnaireRéseauReadModel = {
  id: string;
  nom: string;
};

export type ListeGestionnairesRéseauReadModel = Array<GestionnaireRéseauReadModel>;

export type ListerGestionnairesRéseau = () => Promise<ListeGestionnairesRéseauReadModel>;
