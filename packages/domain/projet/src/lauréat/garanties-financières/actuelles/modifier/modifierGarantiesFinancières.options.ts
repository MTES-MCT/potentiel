import { DateTime, Email } from '@potentiel-domain/common';

import { TypeGarantiesFinancières } from '../../../../candidature';

export type ModifierActuellesOptions = {
  /** @deprecated replace with GarantiesFinancières.ValueType */
  type: TypeGarantiesFinancières.ValueType;
  /** @deprecated replace with GarantiesFinancières.ValueType */
  dateÉchéance?: DateTime.ValueType;
  /** @deprecated replace with GarantiesFinancières.ValueType */
  attestation: { format: string };
  /** @deprecated replace with GarantiesFinancières.ValueType ? */
  dateConstitution: DateTime.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
