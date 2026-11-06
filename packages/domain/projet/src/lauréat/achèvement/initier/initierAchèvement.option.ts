import type { DateTime, Email } from '@potentiel-domain/common';

export type InitierAchèvementOptions = {
  initiéLe: DateTime.ValueType;
  initiéPar: Email.ValueType;
};
