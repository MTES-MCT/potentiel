import type { DateTime, Email } from '@potentiel-domain/common';

import type { Dépôt, DétailCandidature, Instruction } from '../index.js';

export type ImporterCandidatureOptions = {
  dépôt: Dépôt.ValueType;
  instruction: Instruction.ValueType;
  détail: DétailCandidature.RawType;

  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
