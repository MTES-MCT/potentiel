import type { DateTime } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../index.js';

export type PuissanceImportéeEvent = DomainEvent<
  'PuissanceImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    puissanceDeSite?: number;
    importéeLe: DateTime.RawType;
  }
>;
