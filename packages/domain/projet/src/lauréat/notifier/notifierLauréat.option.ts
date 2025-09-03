import { DateTime, Email } from '@potentiel-domain/common';

export type NotifierOptions = {
  attestation: { format: string };
  importerGarantiesFinancières: boolean;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
};
