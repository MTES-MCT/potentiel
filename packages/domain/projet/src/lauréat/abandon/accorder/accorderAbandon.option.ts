import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet } from '../../..';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
