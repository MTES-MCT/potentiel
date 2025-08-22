import type { DateTime } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement } from '../..';

export type ModifierPropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatPropositionTechniqueEtFinancièreSignée: string;
};
