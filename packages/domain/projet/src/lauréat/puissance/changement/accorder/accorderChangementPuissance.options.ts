import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../..';

export type AccorderChangementPuissanceOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  réponseSignée?: DocumentProjet.ValueType;
  estUneDécisionDEtat: boolean;
};
