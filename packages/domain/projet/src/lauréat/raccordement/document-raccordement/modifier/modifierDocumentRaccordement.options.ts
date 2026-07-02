import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { RéférenceDossierRaccordement, TypeDocumentsRaccordement } from '../../index.js';

export type ModifierDocumentRaccordementOptions = {
  dateSignature: DateTime.ValueType;
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  formatDocumentRaccordement: string;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  type: TypeDocumentsRaccordement.ValueType;
  rôle: Role.ValueType;
  estUnNouveauDocument: boolean;
};
