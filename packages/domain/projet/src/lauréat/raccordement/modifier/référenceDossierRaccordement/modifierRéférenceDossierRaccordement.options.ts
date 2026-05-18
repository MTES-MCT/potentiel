import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { RéférenceDossierRaccordement } from '../../index.js';

export type ModifierRéférenceDossierRaccordementOptions = {
  référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
  nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
  rôle: Role.ValueType;
};
