import { DateTime, Email } from '@potentiel-domain/common';

export type InviterPorteurOptions = {
  identifiantsProjet: string[];
  invitéPar: Email.ValueType;
  invitéLe: DateTime.ValueType;
};
