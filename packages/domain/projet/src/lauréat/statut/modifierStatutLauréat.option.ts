import { DateTime, Email } from '@potentiel-domain/common';

import { StatutLauréat } from '../index.js';

export type ModifierStatutLauréatOptions = {
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  statut: StatutLauréat.ValueType;
};
