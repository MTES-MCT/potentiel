import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { DocumentProjet } from '#document-projet';
import type { MotifDemandeDélai } from '../../index.js';

export type AccorderDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateAccord: DateTime.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  nombreDeMois: number;
  motif: MotifDemandeDélai.ValueType;
  rôleUtilisateur: Role.ValueType;
};
