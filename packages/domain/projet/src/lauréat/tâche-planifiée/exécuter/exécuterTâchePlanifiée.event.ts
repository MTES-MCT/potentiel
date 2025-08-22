import type { DateTime } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type TâchePlanifiéeExecutéeEvent = DomainEvent<
  'TâchePlanifiéeExecutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    exécutéeLe: DateTime.RawType;
    typeTâchePlanifiée: string;
  }
>;
