import { DateTime, Email } from '@potentiel-domain/common';

import { DispositifDeStockage } from '../../index.js';
import { DocumentProjet } from '../../../../document-projet/index.js';

export type ModifierDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
