import { DateTime } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../../index.js';

export type ImporterOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  importéLe: DateTime.ValueType;
};
