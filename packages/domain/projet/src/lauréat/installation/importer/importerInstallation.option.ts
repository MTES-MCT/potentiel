import { DateTime, Email } from '@potentiel-domain/common';

export type ImporterOptions = {
  importéPar: Email.ValueType;
  importéLe: DateTime.ValueType;
  installateur: string;
};
