import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { CandidatureImportéeEvent } from '../importer/candidatureImportée.event.js';

/**
 * @deprecated Cet événement n'offre pas la possibilité de mettre à jour les informations fournisseurs.
 */
export type CandidatureCorrigéeEventV1 = DomainEvent<
  'CandidatureCorrigée-V1',
  Omit<
    CandidatureImportéeEvent['payload'],
    'importéLe' | 'importéPar' | 'fournisseurs' | 'typologieInstallation'
  > & {
    corrigéLe: DateTime.RawType;
    corrigéPar: Email.RawType;
    doitRégénérerAttestation?: true;
    détailsMisÀJour?: true;
  }
>;

export type CandidatureCorrigéeEvent = DomainEvent<
  'CandidatureCorrigée-V2',
  Omit<CandidatureImportéeEvent['payload'], 'importéLe' | 'importéPar'> & {
    corrigéLe: DateTime.RawType;
    corrigéPar: Email.RawType;
    doitRégénérerAttestation?: true;
    détailsMisÀJour?: true;
  }
>;
