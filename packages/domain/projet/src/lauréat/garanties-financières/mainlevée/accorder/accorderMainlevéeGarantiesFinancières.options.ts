import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

export type AccorderMainlevéeOptions = {
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
