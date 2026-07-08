import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { RéférenceDossierRaccordement, TypeDocumentsRaccordement } from '../../index.js';

export type SupprimerDocumentOptions = {
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  type: TypeDocumentsRaccordement.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar: Email.ValueType;
  rôle: Role.ValueType;
};
