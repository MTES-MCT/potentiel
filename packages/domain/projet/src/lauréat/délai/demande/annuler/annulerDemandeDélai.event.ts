import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../..';

export type DemandeDélaiAnnuléeEvent = DomainEvent<
  'DemandeDélaiAnnulée-V1',
  {
    annuléLe: DateTime.RawType;
    annuléPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
  }
>;
