import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../document-projet';

export type ModifierNomProjetOptions = {
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  nomProjet: string;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
