import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

export type PuissanceModifiéeEvent = DomainEvent<
  'PuissanceModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance?: number;
    puissanceDeSite?: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
    raison?: string;
  }
>;
