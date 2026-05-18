import { DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../index.js';
import { TypeTâche } from '../index.js';

export type TâcheAchevéeEvent = DomainEvent<
  'TâcheAchevée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    achevéeLe: DateTime.RawType;
    typeTâche: TypeTâche.RawType;
  }
>;
