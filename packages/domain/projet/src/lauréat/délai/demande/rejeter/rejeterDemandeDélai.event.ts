import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

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
