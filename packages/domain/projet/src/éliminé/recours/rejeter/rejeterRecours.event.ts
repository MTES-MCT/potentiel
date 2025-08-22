import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

import type { IdentifiantProjet } from '../../..';

export type RecoursRejetéEvent = DomainEvent<
  'RecoursRejeté-V1',
  {
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
