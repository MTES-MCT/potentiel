import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { CandidatureImportéeEvent } from '../importer/candidatureImportée.event';

export type CandidatureCorrigéeEvent = DomainEvent<
  'CandidatureCorrigée-V1',
  Omit<CandidatureImportéeEvent['payload'], 'importéLe' | 'importéPar'> & {
    corrigéLe: DateTime.RawType;
    corrigéPar: Email.RawType;
    doitRégénérerAttestation?: true;
    détailsMisÀJour?: true;
  }
>;
