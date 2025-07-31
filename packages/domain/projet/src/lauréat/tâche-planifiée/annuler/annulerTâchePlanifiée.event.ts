import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

export type TâchePlanifiéeAnnuléeEvent = DomainEvent<
  'TâchePlanifiéeAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: string;
    annuléeLe: DateTime.RawType;
  }
>;
