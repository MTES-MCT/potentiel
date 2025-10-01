import { DateTime, Email } from '@potentiel-domain/common';

import { DispositifDeStockage } from '..';

export type ImporterDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  importéPar: Email.ValueType;
  importéLe: DateTime.ValueType;
};
