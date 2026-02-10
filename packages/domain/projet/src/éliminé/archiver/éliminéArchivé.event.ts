import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../index.js';

export type ÉliminéArchivéEvent = DomainEvent<
  'ÉliminéArchivé-V1',
  {
    archivéLe: DateTime.RawType;
    archivéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;
