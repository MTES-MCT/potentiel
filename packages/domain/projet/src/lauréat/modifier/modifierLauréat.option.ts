import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';
import { Localité } from '../../candidature';

export type ModifierLauréatOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
};
