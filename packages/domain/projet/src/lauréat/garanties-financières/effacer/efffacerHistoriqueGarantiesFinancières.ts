import { DateTime, Email } from '@potentiel-domain/common';

export type EffacerHistoriqueOptions = {
  effacéLe: DateTime.ValueType;
  effacéPar: Email.ValueType;
};
