import { DateTime, Email } from '@potentiel-domain/common';

import { Dépôt, DétailCandidature, Instruction } from '../index.js';

export type CorrigerCandidatureOptions = {
  dépôt: Dépôt.ValueType;
  instruction: Instruction.ValueType;
  détail?: DétailCandidature.RawType;
  doitRégénérerAttestation?: true;

  corrigéLe: DateTime.ValueType;
  corrigéPar: Email.ValueType;
};
