import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type ConfirmationAbandonDemandéeEvent = DomainEvent<
  'ConfirmationAbandonDemandée-V1',
  {
    confirmationDemandéeLe: DateTime.RawType;
    confirmationDemandéePar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
