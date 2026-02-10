import { DomainEvent } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

export type PuissanceImportéeEvent = DomainEvent<
  'PuissanceImportée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    puissanceDeSite?: number;
    importéeLe: DateTime.RawType;
  }
>;
