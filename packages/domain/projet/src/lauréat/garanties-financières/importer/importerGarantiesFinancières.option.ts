import { DateTime } from '@potentiel-domain/common';

import { TypeGarantiesFinancières } from '../../../candidature';

export type ImporterOptions = {
  type?: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  importéLe: DateTime.ValueType;
};
