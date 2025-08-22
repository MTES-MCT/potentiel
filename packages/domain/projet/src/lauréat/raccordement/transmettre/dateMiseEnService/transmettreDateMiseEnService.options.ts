import type { DateTime, Email } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement } from '../..';

export type TransmettreDateMiseEnServiceOptions = {
  dateMiseEnService: DateTime.ValueType;
  dateDésignation: DateTime.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  transmiseLe: DateTime.ValueType;
  transmisePar: Email.ValueType;
};
