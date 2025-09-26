import { DateTime, Email } from '@potentiel-domain/common';

import { Localité } from '../../candidature';

export type ModifierSiteDeProductionOptions = {
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  localité: Localité.ValueType;
};
