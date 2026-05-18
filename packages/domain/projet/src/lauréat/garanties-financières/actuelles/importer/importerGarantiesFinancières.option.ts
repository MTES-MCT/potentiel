import type { DateTime } from '@potentiel-domain/common';

import type { GarantiesFinancières } from '../../index.js';

export type ImporterOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  importéLe: DateTime.ValueType;
};
