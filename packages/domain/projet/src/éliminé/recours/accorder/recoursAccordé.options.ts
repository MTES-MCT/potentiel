import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../..';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
