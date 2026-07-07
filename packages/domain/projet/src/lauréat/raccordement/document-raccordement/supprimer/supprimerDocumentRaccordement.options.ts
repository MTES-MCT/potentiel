import type { DateTime, Email } from '@potentiel-domain/common';

import type { RéférenceDossierRaccordement, TypeDocumentsRaccordement } from '../../index.js';

export type SupprimerDocumentRaccordementOptions = {
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  type: TypeDocumentsRaccordement.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: Email.ValueType;
};
