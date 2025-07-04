import { DateTime } from '@potentiel-domain/common';

import { RéférenceDossierRaccordement } from '../..';

export type TransmettrePropositionTechniqueEtFinancièreOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatPropositionTechniqueEtFinancièreSignée: string;
};
