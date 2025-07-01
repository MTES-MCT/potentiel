import { DateTime, Email } from '@potentiel-domain/common';

export type ImporterOptions = {
  nomReprésentantLégal: string;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
