import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
