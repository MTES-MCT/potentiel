import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

export type RejeterOptions = {
  dateRejet: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  rôleUtilisateur: Role.ValueType;
};
