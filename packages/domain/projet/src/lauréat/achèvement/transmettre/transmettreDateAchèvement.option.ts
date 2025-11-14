import { DateTime, Email } from '@potentiel-domain/common';

export type TransmettreDateAchèvementOptions = {
  attestation: { format: string };
  dateAchèvement: DateTime.ValueType;
  transmiseLe: DateTime.ValueType;
  transmisePar: Email.ValueType;
};
