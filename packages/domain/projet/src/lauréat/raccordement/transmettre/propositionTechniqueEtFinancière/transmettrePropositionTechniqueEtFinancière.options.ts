import type { DateTime } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement } from '../..';

export type TransmettrePropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatPropositionTechniqueEtFinancièreSignée: string;
};
