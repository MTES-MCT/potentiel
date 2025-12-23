import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type DétailCandidatureCorrigéEvent = DomainEvent<
  'DétailCandidatureCorrigé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    détail: Record<string, string | number | boolean>;
  }
>;
