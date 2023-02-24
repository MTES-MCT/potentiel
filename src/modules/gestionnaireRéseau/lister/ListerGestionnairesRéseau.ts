export const PermissionListerGestionnairesRéseau = {
  nom: 'lister-gestionnaires-réseau',
  description: 'Lister les gestionnaires de réseau',
};

type GestionnaireRéseauReadModel = {
  codeEIC: string;
  raisonSociale: string;
};

export type ListeGestionnairesRéseauReadModel = Array<GestionnaireRéseauReadModel>;

export type ListerGestionnairesRéseau = () => Promise<ListeGestionnairesRéseauReadModel>;
