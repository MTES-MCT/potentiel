import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type DétailCandidatureImportéEvent = DomainEvent<
  'DétailCandidatureImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: Record<string, string | number | boolean>;
    importéLe: DateTime.RawType;
    importéPar: Email.RawType;
  }
>;
