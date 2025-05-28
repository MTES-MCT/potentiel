import { DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../..';

export type PreuveRecandidatureDemandéeEvent = DomainEvent<
  'PreuveRecandidatureDemandée-V1',
  {
    demandéeLe: DateTime.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;
