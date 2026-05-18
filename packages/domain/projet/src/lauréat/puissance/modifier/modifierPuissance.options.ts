import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  puissanceDeSite?: number;
  dateModification: DateTime.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
