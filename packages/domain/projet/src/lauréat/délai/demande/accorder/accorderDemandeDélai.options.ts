import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet } from '#document-projet';

export type AccorderDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateAccord: DateTime.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  nombreDeMois: number;
  rôleUtilisateur: Role.ValueType;
};
