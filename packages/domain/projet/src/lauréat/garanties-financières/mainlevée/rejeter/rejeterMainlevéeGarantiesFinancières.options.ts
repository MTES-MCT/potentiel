import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

export type RejeterMainlevéeOptions = {
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
