import type { DateTime } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type PuissanceImportéeEvent = DomainEvent<
  'PuissanceImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    importéeLe: DateTime.RawType;
  }
>;
