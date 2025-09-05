import { DateTime, Email } from '@potentiel-domain/common';

export type AnnulerMainlevéeOption = {
  annuléLe: DateTime.ValueType;
  annuléPar: Email.ValueType;
};
