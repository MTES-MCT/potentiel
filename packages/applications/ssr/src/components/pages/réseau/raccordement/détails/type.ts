/**
 * @deprecated À supprimer une fois que raccordement passera en mode isomorphique
 */
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
