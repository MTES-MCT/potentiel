import { DateTime, Email } from '@potentiel-domain/common';

export type ModifierNomProjetOptions = {
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  nomProjet: string;
};
