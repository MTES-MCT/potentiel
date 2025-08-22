import type { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { DomainEvent } from '@potentiel-domain/core';

export type TâchePlanifiéeAnnuléeEvent = DomainEvent<
  'TâchePlanifiéeAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: string;
    annuléeLe: DateTime.RawType;
  }
>;
