import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../index.js';

export type RejeterOptions = {
  dateRejet: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
