import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';
import type { DispositifDeStockage } from '../../index.js';

export type ModifierDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
