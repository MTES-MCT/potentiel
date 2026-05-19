import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';
import type { DétailCandidature } from '../../index.js';

export type DétailCandidatureImportéEvent = DomainEvent<
  'DétailCandidatureImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: DétailCandidature.RawType;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;
