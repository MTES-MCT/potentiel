import { ExpressionRegulière } from '@potentiel-domain/common';
import { IdentifiantGestionnaireRéseau } from './gestionnaire';

export type GestionnaireRéseauReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
};
