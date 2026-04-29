import { Email, ExpressionRegulière } from '@potentiel-domain/common';

export type ModifierOptions = {
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format?: string;
    légende?: string;
    expressionReguliere?: ExpressionRegulière.ValueType;
  };
  contactEmail?: Email.ValueType;
};
