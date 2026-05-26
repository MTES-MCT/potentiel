import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DocumentProjet } from '#document-projet';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  ppaSignalé?: true;
  ppaAnnulé?: true;
};
