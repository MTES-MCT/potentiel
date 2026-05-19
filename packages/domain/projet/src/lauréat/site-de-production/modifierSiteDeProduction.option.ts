import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';
import type { Coordonnées, Localité } from '../../candidature/index.js';

export type ModifierSiteDeProductionOptions = {
  modifiéLe: DateTime.ValueType;
  modifiéPar: Email.ValueType;
  localité: Localité.ValueType;
  coordonnées?: Coordonnées.ValueType;
  raison: string;
  pièceJustificative: DocumentProjet.ValueType | undefined;
};
