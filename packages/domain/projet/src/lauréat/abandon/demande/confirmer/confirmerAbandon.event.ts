import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../../index.js';

export type AbandonConfirméEvent = DomainEvent<
  'AbandonConfirmé-V1',
  {
    confirméLe: DateTime.RawType;
    confirméPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;
