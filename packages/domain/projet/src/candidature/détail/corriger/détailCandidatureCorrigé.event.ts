import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type DétailCandidatureCorrigéEvent = DomainEvent<
  'DétailCandidatureCorrigé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    corrigéLe: DateTime.RawType;
    corrigéPar: Email.RawType;
    détail: Record<string, string | number | boolean>;
  }
>;
