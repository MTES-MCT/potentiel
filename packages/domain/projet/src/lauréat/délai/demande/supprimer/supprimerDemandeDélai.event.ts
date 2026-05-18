import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

export type DemandeDélaiSuppriméeEvent = DomainEvent<
  'DemandeDélaiSupprimée-V1',
  {
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    dateDemande: DateTime.RawType;
  }
>;
