import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../../index.js';

export type AccorderChangementOptions = {
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
