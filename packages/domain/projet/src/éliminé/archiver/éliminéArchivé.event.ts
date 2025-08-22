import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../..';

export type ÉliminéArchivéEvent = DomainEvent<
  'ÉliminéArchivé-V1',
  {
    archivéLe: DateTime.RawType;
    archivéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;
