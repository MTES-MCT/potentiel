import { DateTime, Email } from '@potentiel-domain/common';

import { Utilisateur } from '../index.js';

export type InviterOptions = {
  utilisateur: Utilisateur.ValueType;
  invitéLe: DateTime.ValueType;
  invitéPar: Email.ValueType;
};
