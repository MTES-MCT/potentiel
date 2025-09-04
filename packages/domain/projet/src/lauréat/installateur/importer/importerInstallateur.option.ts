import { DateTime, Email } from '@potentiel-domain/common';

export type ImporterOptions = {
  installateur: string;
  importéPar: Email.ValueType;
  importéLe: DateTime.ValueType;
};
