import { DateTime } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../..';

export type ImporterOptions = {
  garantiesFinancières?: GarantiesFinancières.ValueType;
  importéLe: DateTime.ValueType;
};
