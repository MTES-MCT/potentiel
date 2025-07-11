import { DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type TâchePlanifiéeExecutéeEvent = DomainEvent<
  'TâchePlanifiéeExecutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    exécutéeLe: DateTime.RawType;
    typeTâchePlanifiée: string;
  }
>;
