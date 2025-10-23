import { DateTime, Email } from '@potentiel-domain/common';

import { Role, Région, Zone } from '..';

export type ModifierRôleOptions = {
  rôle: Role.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  fonction?: string;
  nomComplet?: string;
  région?: Région.ValueType;
  identifiantGestionnaireRéseau?: string;
  zone?: Zone.ValueType;
};
