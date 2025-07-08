import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

export type ModifierOptions = {
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: Option.Type<string>;
    légende: Option.Type<string>;
    expressionReguliere: Option.Type<ExpressionRegulière.ValueType>;
  };
  contactEmail: Option.Type<Email.ValueType>;
};
