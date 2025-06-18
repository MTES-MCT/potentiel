import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';

export type AccorderChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
