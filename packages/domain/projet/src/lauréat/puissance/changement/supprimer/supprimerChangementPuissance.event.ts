import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

export type ChangementPuissanceSuppriméEvent = DomainEvent<
  'ChangementPuissanceSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar: Email.RawType;
  }
>;
