import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

export type RecoursAccordéEvent = DomainEvent<
  'RecoursAccordé-V1',
  {
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    identifiantProjet: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
