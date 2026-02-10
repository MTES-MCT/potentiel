import { DateTime, Email } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../../index.js';

export type TransmettreDateMiseEnServiceOptions = {
  dateMiseEnService: DateTime.ValueType;
  dateDésignation: DateTime.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  transmiseLe: DateTime.ValueType;
  transmisePar: Email.ValueType;
};
