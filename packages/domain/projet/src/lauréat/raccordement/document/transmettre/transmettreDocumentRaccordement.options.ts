import type { DateTime, Email } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement, TypeDocumentsRaccordement } from '../../index.js';

export type TransmettreDocumentOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatDocumentRaccordement: string;
  transmisLe: DateTime.ValueType;
  transmisPar: Email.ValueType;
  type: TypeDocumentsRaccordement.ValueType;
};
