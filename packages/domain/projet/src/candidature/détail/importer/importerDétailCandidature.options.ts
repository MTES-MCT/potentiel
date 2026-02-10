import { DateTime, Email } from '@potentiel-domain/common';

import { DétailCandidature } from '../../index.js';

export type ImporterDétailCandidatureOptions = {
  détail: DétailCandidature.RawType;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
