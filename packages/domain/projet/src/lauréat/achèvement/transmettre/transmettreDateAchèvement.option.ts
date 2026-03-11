import { DateTime, Email } from '@potentiel-domain/common';

export type TransmettreDateAchèvementOptions = {
  dateAchèvement: DateTime.ValueType;
  transmiseLe: DateTime.ValueType;
  transmisePar: Email.ValueType;
};
