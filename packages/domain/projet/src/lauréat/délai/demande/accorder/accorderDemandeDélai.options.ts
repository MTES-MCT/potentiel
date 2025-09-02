import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

export type AccorderDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateAccord: DateTime.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  nombreDeMois: number;
  rôleUtilisateur: Role.ValueType;
};
