import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

export type InstruireOptions = {
  dateInstruction: DateTime.ValueType;
  identifiantUtilisateur: Email.ValueType;
  rôleUtilisateur: Role.ValueType;
};
