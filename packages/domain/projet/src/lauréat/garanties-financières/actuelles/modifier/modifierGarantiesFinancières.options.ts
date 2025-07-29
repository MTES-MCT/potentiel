import { DateTime, Email } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../..';

export type ModifierActuellesOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  /** @deprecated move to GarantiesFinancières.ValueType */
  attestation: { format: string };
  /** @deprecated move to GarantiesFinancières.ValueType */
  dateConstitution: DateTime.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
