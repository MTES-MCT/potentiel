import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../index.js';

export type RejeterMainlevéeOptions = {
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
