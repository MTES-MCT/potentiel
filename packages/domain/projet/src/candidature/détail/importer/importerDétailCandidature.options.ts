import { DateTime, Email } from '@potentiel-domain/common';

import { DétailCandidature } from '../détailCandidature.type';

export type ImporterDétailCandidatureOptions = {
  détail: DétailCandidature;
  importéLe: DateTime.ValueType;
  importéPar: Email.ValueType;
};
