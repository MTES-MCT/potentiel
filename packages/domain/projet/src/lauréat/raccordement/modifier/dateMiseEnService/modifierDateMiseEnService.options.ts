import type { DateTime, Email } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement } from '../../index.js';

export type ModifierDateMiseEnServiceOptions = {
  dateMiseEnService: DateTime.ValueType;
  dateDésignation: DateTime.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  modifiéeLe: DateTime.ValueType;
  modifiéePar: Email.ValueType;
};
