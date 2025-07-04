import { ExpressionRegulière, DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { RéférenceDossierRaccordement } from '../..';

export type ModifierRéférenceDossierRaccordementOptions = {
  référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
  nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  référenceDossierExpressionRegulière: ExpressionRegulière.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
  rôle: Role.ValueType;
};
