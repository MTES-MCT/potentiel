import { DateTime, Email } from '@potentiel-domain/common';

import { DétailCandidature } from '../..';

export type ImporterDétailCandidatureOptions = {
  détail: DétailCandidature.RawType;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
