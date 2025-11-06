import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../..';

export type RejeterChangementPuissanceOptions = {
  rejetéLe: DateTime.ValueType;
  rejetéPar: Email.ValueType;
  réponseSignée: DocumentProjet.ValueType;
  estUneDécisionDEtat: boolean;
};
