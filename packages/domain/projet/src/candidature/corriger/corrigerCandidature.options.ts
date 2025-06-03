import { DateTime, Email } from '@potentiel-domain/common';

import { ImporterCandidatureOptions } from '../importer/importerCandidature.options';

export type CorrigerCandidatureOptions = Omit<
  ImporterCandidatureOptions,
  'importéLe' | 'importéPar' | 'fournisseurs'
> & {
  corrigéLe: DateTime.ValueType;
  corrigéPar: Email.ValueType;
  doitRégénérerAttestation?: true;
  détailsMisÀJour?: true;
};
