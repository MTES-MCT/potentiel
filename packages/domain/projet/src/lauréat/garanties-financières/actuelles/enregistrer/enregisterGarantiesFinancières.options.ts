import { DateTime, Email } from '@potentiel-domain/common';

import { TypeGarantiesFinancières } from '../../../../candidature';

export type EnregisterOptions = {
  type: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  attestation: { format: string };
  dateConstitution: DateTime.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: Email.ValueType;
};
