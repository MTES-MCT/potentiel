import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

export type AjouterOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: Option.Type<string>;
    légende: Option.Type<string>;
    expressionReguliere: Option.Type<ExpressionRegulière.ValueType>;
  };
  contactEmail: Option.Type<Email.ValueType>;
};
