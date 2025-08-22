import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

export type AccorderDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateAccord: DateTime.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  nombreDeMois: number;
};
