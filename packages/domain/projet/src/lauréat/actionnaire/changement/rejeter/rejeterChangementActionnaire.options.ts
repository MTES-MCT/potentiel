import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';

export type RejeterChangementOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
