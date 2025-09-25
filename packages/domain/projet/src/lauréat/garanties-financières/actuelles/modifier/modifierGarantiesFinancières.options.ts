import { DateTime, Email } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../..';

export type ModifierActuellesOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
