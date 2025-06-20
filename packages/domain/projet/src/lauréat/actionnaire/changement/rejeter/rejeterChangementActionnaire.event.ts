import { DateTime, Email } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { IdentifiantProjet } from '../../../..';

export type ChangementActionnaireRejetéEvent = DomainEvent<
  'ChangementActionnaireRejeté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    rejetéLe: DateTime.RawType;
    rejetéPar: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
