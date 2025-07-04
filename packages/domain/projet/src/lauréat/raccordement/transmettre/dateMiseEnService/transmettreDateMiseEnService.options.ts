import { DateTime, Email } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../..';
import { IdentifiantProjet } from '../../../..';

export type TransmettreDateMiseEnServiceOptions = {
  dateMiseEnService: DateTime.ValueType;
  dateDésignation: DateTime.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  transmiseLe: DateTime.ValueType;
  transmisePar: Email.ValueType;
};
