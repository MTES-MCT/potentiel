import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

export type AccorderOptions = {
  dateAccord: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
