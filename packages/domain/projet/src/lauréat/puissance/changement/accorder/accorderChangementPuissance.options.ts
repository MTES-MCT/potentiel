import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../..';

export type AccorderChangementPuissanceOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
  réponseSignée?: DocumentProjet.ValueType;
  estUneDécisionDEtat: boolean;
};
