import { DateTime, Email } from '@potentiel-domain/common';

import { Utilisateur } from '..';

export type ModifierRôleOptions = {
  nouvelUtilisateur: Utilisateur.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
};
