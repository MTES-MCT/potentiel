import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Role } from '@potentiel-domain/utilisateur';

import type { IdentifiantProjet } from '../../../..';

export type AccorderChangementPuissanceOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
  réponseSignée?: DocumentProjet.ValueType;
  estUneDécisionDEtat: boolean;
};
