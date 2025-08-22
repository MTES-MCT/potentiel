import type { DateTime, Email } from '@potentiel-domain/common';

import type { Dépôt, Instruction } from '..';

export type CorrigerCandidatureOptions = {
  dépôt: Dépôt.ValueType;
  instruction: Instruction.ValueType;
  corrigéLe: DateTime.ValueType;
  corrigéPar: Email.ValueType;
  doitRégénérerAttestation?: true;
  détailsMisÀJour?: true;
};
