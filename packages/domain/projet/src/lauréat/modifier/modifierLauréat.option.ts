import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

export type ModifierLauréatOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  nomProjet: string;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    région: string;
    département: string;
  };
};
