import { DateTime, Email } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../../index.js';

export type TransmettreDemandeOptions = {
  dateQualification: DateTime.ValueType;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  transmisePar: Email.ValueType;
  transmiseLe: DateTime.ValueType;
  formatAccuséRéception?: string;
};
