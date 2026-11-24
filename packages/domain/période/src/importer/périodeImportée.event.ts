import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type * as IdentifiantPériode from '../identifiantPériode.valueType.js';

export type PériodeImportéeEvent = DomainEvent<
  'PériodeImportée-V1',
  {
    identifiantPériode: IdentifiantPériode.RawType;

    importéLe: DateTime.RawType;
    importéPar: Email.RawType;

    projetsEnErreur: Array<{ identifiantProjet: IdentifiantProjet.RawType; motif: string }>;
  }
>;
