import { DateTime, Email } from '@potentiel-domain/common';

import { DétailCandidature } from '../détailCandidature.type';

export type CorrigerDétailCandidatureOptions = {
  détail: DétailCandidature;
  corrigéLe: DateTime.ValueType;
  corrigéPar: Email.ValueType;
};
