import { DateTime, Email } from '@potentiel-domain/common';

import { Role, Région, Zone } from '..';

export type InviterOptions = {
  rôle: Role.ValueType;
  invitéLe: DateTime.ValueType;
  invitéPar: Email.ValueType;

  fonction?: string;
  nomComplet?: string;
  région?: Région.ValueType;
  identifiantGestionnaireRéseau?: string;
  zone?: Zone.ValueType;
};
