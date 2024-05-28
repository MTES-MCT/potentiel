export type GestionnaireRéseau = {
  identifiantGestionnaireRéseau: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: string;
  };
  contactEmail?: string;
  canEdit: boolean;
};
