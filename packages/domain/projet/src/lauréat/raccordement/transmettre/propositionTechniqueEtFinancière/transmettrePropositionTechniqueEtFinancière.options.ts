import type { DateTime, Email } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement } from '../../index.js';

export type TransmettrePropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatPropositionTechniqueEtFinancièreSignée: string;
  transmiseLe: DateTime.ValueType;
  transmisePar: Email.ValueType;
};
