import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../..';

export type ÉliminéArchivéEvent = DomainEvent<
  'ÉliminéArchivé-V1',
  {
    archivéLe: DateTime.RawType;
    archivéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;
