import { DateTime, Email } from '@potentiel-domain/common';

import { Utilisateur } from '..';

export type InviterOptions = {
  utilisateur: Utilisateur.ValueType;
  invitéLe: DateTime.ValueType;
  invitéPar: Email.ValueType;
};
