import { Email, ExpressionRegulière } from '@potentiel-domain/common';

export type AjouterOptions = {
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format?: string;
    légende?: string;
    expressionReguliere?: ExpressionRegulière.ValueType;
  };
  contactEmail?: Email.ValueType;
};
