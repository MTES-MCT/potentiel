import { DateTime, Email } from '@potentiel-domain/common';

export type DésactiverOptions = {
  désactivéLe: DateTime.ValueType;
  désactivéPar: Email.ValueType;
};
