import { DomainEvent } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type DatePrévisionnelleCalculéeEvent = DomainEvent<
  'DatePrévisionnelleCalculée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    date: DateTime.RawType;
  }
>;
