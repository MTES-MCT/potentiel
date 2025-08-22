import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

export type PuissanceModifiéeEvent = DomainEvent<
  'PuissanceModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    puissance: number;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
    raison?: string;
  }
>;
