import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../index.js';

export type ÉliminéArchivéEvent = DomainEvent<
  'ÉliminéArchivé-V1',
  {
    archivéLe: DateTime.RawType;
    archivéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;
