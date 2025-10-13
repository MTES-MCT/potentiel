import { DateTime, Email } from '@potentiel-domain/common';

import { DispositifDeStockage } from '../..';

export type ModifierDispositifDeStockageOptions = {
  dispositifDeStockage: DispositifDeStockage.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
