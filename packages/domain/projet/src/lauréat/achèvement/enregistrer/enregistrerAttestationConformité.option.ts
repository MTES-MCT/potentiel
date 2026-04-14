import { DateTime, Email } from '@potentiel-domain/common';

export type EnregistrerAttestationConformitéOptions = {
  attestationConformité: { format: string };
  enregistréeLe: DateTime.ValueType;
  enregistréePar: Email.ValueType;
};
