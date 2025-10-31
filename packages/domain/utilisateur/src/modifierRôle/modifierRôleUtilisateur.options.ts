import { DateTime, Email } from '@potentiel-domain/common';

import { Role, Région, Zone } from '..';

export type ModifierRôleOptions = {
  rôle: Role.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  fonction: string | undefined;
  nomComplet: string | undefined;
  région: Région.ValueType | undefined;
  identifiantGestionnaireRéseau: string | undefined;
  zone: Zone.ValueType | undefined;
};
