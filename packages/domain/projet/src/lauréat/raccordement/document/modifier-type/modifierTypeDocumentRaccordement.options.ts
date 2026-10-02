import type { DateTime, Email } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement, TypeDocumentsRaccordement } from '../../index.js';

export type ModifierTypeDocumentOptions = {
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  ancienType: TypeDocumentsRaccordement.ValueType;
  nouveauType: TypeDocumentsRaccordement.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
