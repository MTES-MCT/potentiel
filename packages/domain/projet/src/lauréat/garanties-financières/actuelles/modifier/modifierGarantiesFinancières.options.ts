import type { DateTime, Email } from '@potentiel-domain/common';

import type { GarantiesFinancières } from '../../index.js';

export type ModifierActuellesOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  estUnNouveauDocument: boolean;
};
