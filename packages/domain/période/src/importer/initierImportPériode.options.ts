import type { DateTime, Email } from '@potentiel-domain/common';
import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import type { IdentifiantPériode } from '../période.js';

export type InitierImportPériodeOptions = {
  identifiantPériode: IdentifiantPériode.ValueType;
  initiéLe: DateTime.ValueType;
  initiéPar: Email.ValueType;
  instruction: Array<
    { identifiantProjet: IdentifiantProjet.ValueType } & Candidature.Instruction.ValueType
  >;
};
