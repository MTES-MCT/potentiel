import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet } from '../../../../index.js';

export type AccorderDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateAccord: DateTime.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  nombreDeMois: number;
  rôleUtilisateur: Role.ValueType;
};
