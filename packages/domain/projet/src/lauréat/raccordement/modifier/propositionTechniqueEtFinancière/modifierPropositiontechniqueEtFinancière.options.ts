import { DateTime } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../..';

export type ModifierPropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatPropositionTechniqueEtFinancièreSignée: string;
};
