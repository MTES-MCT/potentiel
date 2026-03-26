import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

import { Localité } from '../../candidature/index.js';

export type ModifierSiteDeProductionOptions = {
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  localité: Localité.ValueType;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType | undefined;
};
