import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

export type RejeterDemandeDélaiOptions = {
  rejetéeLe: DateTime.ValueType;
  rejetéePar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
