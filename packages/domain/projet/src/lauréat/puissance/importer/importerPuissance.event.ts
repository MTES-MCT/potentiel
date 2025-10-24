import { DomainEvent } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

export type PuissanceImportéeEvent = DomainEvent<
  'PuissanceImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    puissanceDeSite?: number;
    importéeLe: DateTime.RawType;
  }
>;
