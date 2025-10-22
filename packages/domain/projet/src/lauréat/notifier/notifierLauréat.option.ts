import { DateTime, Email } from '@potentiel-domain/common';

export type NotifierOptions = {
  attestation: { format: string };
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
};
