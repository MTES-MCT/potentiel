import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { RéférenceDossierRaccordement } from '../..';

export type ModifierRéférenceDossierRaccordementOptions = {
  référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
  nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
  rôle: Role.ValueType;
};
