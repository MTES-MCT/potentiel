import { DomainEvent } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type DateAchèvementPrévisionnelCalculéeEvent = DomainEvent<
  'DateAchèvementPrévisionnelCalculée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    date: DateTime.RawType;
  }
>;
