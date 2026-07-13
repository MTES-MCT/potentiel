import type { DateTime, Email } from '@potentiel-domain/common';

export type CorrigerDateAchèvementOptions = {
  dateAchèvement: DateTime.ValueType;
  corrigéeLe: DateTime.ValueType;
  corrigéePar: Email.ValueType;
};
