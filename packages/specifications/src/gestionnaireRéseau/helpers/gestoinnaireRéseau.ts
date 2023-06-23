export type GestionnaireRéseau = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: string;
  };
};
