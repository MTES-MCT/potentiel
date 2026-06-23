import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  RéférenceDossierRaccordement,
  TypeDocumentConventionRaccordement,
} from '../../index.js';

export type TransmettreDocumentRaccordementOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatDocumentRaccordement: string;
  transmisLe: DateTime.ValueType;
  transmisPar: Email.ValueType;
  type: TypeDocumentConventionRaccordement.ValueType;
};
