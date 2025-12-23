import { DateTime, Email } from '@potentiel-domain/common';

import { DispositifDeStockage } from '../..';
import { DocumentProjet } from '../../../../document-projet';

export type ModifierDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  raison?: string;
  pièceJustificative?: DocumentProjet.ValueType;
};
