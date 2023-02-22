export type GestionnaireRéseauReadModel = {
  id: string;
  nom: string;
};

export type ListerGestionnairesRéseau = () => Promise<Array<GestionnaireRéseauReadModel>>;
