import { DateTime, Email } from '@potentiel-domain/common';

import { Localité } from '../../candidature';
import { DocumentProjet } from '../../document-projet';

export type ModifierSiteDeProductionOptions = {
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  localité: Localité.ValueType;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType | undefined;
};
