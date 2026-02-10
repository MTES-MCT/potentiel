import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../../index.js';

export type AbandonRejetéEvent = DomainEvent<
  'AbandonRejeté-V1',
  {
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
