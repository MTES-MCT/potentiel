import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Role } from '@potentiel-domain/utilisateur';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
