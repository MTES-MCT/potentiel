import { Email, DateTime } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../index.js';

export type ModifierOptions = {
  identifiantUtilisateur: Email.ValueType;
  actionnaire: string;
  dateModification: DateTime.ValueType;
  pièceJustificative?: DocumentProjet.ValueType;
  raison: string;
};
