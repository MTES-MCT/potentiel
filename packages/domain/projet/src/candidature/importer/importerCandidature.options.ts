import { DateTime, Email } from '@potentiel-domain/common';

import * as DépôtCandidature from '../dépôtCandidature.valueType';
import * as InstructionCandidature from '../instructionCandidature.valueType';

export type ImporterCandidatureOptions = {
  dépôtCandidature: DépôtCandidature.ValueType;
  instructionCandidature: InstructionCandidature.ValueType;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
