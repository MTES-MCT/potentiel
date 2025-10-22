import { DateTime, Email } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../garanties-financières';

export type NotifierOptions = {
  attestation: { format: string };
  garantiesFinancières: GarantiesFinancières.ValueType | undefined;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
};
