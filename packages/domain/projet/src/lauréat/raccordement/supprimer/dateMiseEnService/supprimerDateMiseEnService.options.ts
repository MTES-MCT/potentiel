import { DateTime, Email } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../../index.js';

export type SupprimerDateMiseEnServiceOptions = {
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  suppriméeLe: DateTime.ValueType;
  suppriméePar: Email.ValueType;
};
