import { DateTime, Email } from '@potentiel-domain/common';

import { Dépôt, Instruction } from '..';

export type ImporterCandidatureOptions = {
  dépôt: Dépôt.ValueType;
  instruction: Instruction.ValueType;

  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
