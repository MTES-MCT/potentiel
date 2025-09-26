import { DateTime, Email } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../..';

export type EnregistrerOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: Email.ValueType;
};
