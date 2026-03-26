import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

import { DispositifDeStockage } from '../../index.js';

export type ModifierDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  raison: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
