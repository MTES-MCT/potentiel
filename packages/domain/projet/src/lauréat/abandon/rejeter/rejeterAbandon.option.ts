import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet } from '../../..';

export type RejeterOptions = {
  dateRejet: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  rôleUtilisateur: Role.ValueType;
};
