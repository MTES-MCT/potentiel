import { DateTime, Email } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../..';

export type EnregisterOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  attestation: { format: string };
  dateConstitution: DateTime.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: Email.ValueType;
};
