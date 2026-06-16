import type { DateTime, Email } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

/**
 * @deprecated Utilisez RecoursAccordéEvent à la place.
 * @deprecated Cet évènement ne contenait pas la date de l'accord réel
 */
export type RecoursAccordéV1Event = DomainEvent<
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

export type RecoursAccordéEvent = DomainEvent<
  'RecoursAccordé-V2',
  {
    accordéLe: DateTime.RawType;
    accordéPar: Email.RawType;
    dateRéponseSignée: DateTime.RawType;
    identifiantProjet: Email.RawType;
    réponseSignée: {
      format: string;
    };
  }
>;
