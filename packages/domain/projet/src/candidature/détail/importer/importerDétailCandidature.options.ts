import type { DateTime, Email } from '@potentiel-domain/common';

import type { DétailCandidature } from '../../index.js';

export type ImporterDétailCandidatureOptions = {
  détail: DétailCandidature.RawType;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
