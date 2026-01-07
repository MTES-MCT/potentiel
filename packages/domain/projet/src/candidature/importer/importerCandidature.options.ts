import { DateTime, Email } from '@potentiel-domain/common';

import { Dépôt, DétailCandidature, Instruction } from '..';

export type ImporterCandidatureOptions = {
  dépôt: Dépôt.ValueType;
  instruction: Instruction.ValueType;
  détail: DétailCandidature;

  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
