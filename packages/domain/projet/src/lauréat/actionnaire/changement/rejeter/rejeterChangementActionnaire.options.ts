import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';

export type RejeterChangementOptions = {
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
