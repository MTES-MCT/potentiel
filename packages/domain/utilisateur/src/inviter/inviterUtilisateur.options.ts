import type { DateTime, Email } from '@potentiel-domain/common';

import type { Utilisateur } from '../index.js';

export type InviterOptions = {
  utilisateur: Utilisateur.ValueType;
  invitéLe: DateTime.ValueType;
  invitéPar: Email.ValueType;
};
