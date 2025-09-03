import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

export type PasserEnInstructionDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  datePassageEnInstruction: DateTime.ValueType;
  rôleUtilisateur: Role.ValueType;
};
