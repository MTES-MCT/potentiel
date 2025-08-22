import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../../..';

export type ChangementActionnaireSuppriméEvent = DomainEvent<
  'ChangementActionnaireSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
  }
>;
