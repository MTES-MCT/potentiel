import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type AbandonAccordéEvent = DomainEvent<
  'AbandonAccordé-V1',
  {
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
