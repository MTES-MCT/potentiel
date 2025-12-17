import { Email, DateTime } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../document-projet';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  puissance: number;
  puissanceDeSite?: number;
  dateModification: DateTime.ValueType;
  raison?: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
