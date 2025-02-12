import { DateTime, Email } from '@potentiel-domain/common';

export type NotifierÉliminéOptions = {
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  attestation: {
    format: string;
  };
};
