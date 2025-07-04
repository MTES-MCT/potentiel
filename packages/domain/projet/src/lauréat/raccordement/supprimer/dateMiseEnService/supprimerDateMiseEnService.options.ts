import { DateTime, Email } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../..';

export type SupprimerDateMiseEnServiceOptions = {
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  suppriméeLe: DateTime.ValueType;
  suppriméePar: Email.ValueType;
};
