import { DateTime, Email } from '@potentiel-domain/common';

import { Role } from '..';

export type InviterOptions = {
  rôle: Role.ValueType;
  invitéLe: DateTime.ValueType;
  invitéPar: Email.ValueType;

  fonction?: string;
  nomComplet?: string;
  région?: string;
  identifiantGestionnaireRéseau?: string;
  zone?: string;
};
