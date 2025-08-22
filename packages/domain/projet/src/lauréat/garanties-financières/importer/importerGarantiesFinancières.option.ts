import type { DateTime } from '@potentiel-domain/common';

import type { GarantiesFinancières } from '..';

export type ImporterOptions = {
  garantiesFinancières?: GarantiesFinancières.ValueType;
  importéLe: DateTime.ValueType;
};
