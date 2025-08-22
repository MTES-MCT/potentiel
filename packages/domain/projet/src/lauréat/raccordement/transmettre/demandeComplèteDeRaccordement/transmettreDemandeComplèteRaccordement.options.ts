import type { DateTime, Email } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement } from '../..';

export type TransmettreDemandeOptions = {
  dateQualification: DateTime.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  transmisePar: Email.ValueType;
  transmiseLe: DateTime.ValueType;
  formatAccuséRéception?: string;
};
