import type { DateTime, Email } from '@potentiel-domain/common';

export type PasserEnInstructionDemandeDélaiOptions = {
  identifiantUtilisateur: Email.ValueType;
  datePassageEnInstruction: DateTime.ValueType;
};
