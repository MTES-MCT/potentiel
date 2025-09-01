import { DateTime, Email } from '@potentiel-domain/common';

export type ValiderDépôtOptions = {
  validéLe: DateTime.ValueType;
  validéPar: Email.ValueType;
};
