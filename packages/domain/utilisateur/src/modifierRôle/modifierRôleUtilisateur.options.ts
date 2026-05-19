import type { DateTime, Email } from '@potentiel-domain/common';

import type { Utilisateur } from '../index.js';

export type ModifierRôleOptions = {
  nouvelUtilisateur: Utilisateur.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
