import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../..';

export type DemandeDélaiRejetéeEvent = DomainEvent<
  'DemandeDélaiRejetée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
    rejetéeLe: DateTime.RawType;
    rejetéePar: Email.RawType;
    réponseSignée: { format: string };
  }
>;
