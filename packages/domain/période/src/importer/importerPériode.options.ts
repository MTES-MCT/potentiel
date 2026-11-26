import type { DateTime, Email } from '@potentiel-domain/common';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type { IdentifiantPériode } from '../période.js';

export type ImporterPériodeOptions = {
  identifiantPériode: IdentifiantPériode.ValueType;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
  projetsEnErreur: Array<{ identifiantProjet: IdentifiantProjet.ValueType; motif: string }>;
};
