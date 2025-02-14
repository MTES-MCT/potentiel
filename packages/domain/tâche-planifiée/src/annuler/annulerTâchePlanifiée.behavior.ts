import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as StatutTâchePlanifiée from '../statutTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';

export type TâchePlanifiéeAnnuléeEvent = DomainEvent<
  'TâchePlanifiéeAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: string;
    annuléeLe: DateTime.RawType;
  }
>;

export type AnnulerOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: string;
};

export async function annuler(this: TâchePlanifiéeAggregate) {
  if (this.statut.estÉgaleÀ(StatutTâchePlanifiée.enAttenteExécution)) {
    const event: TâchePlanifiéeAnnuléeEvent = {
      type: 'TâchePlanifiéeAnnulée-V1',
      payload: {
        annuléeLe: DateTime.now().formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        typeTâchePlanifiée: this.typeTâchePlanifiée,
      },
    };
    await this.publish(event);
  }
}

export function applyTâchePlanifiéeAnnulée(
  this: TâchePlanifiéeAggregate,
  { payload: { annuléeLe } }: TâchePlanifiéeAnnuléeEvent,
) {
  this.annuléeLe = DateTime.convertirEnValueType(annuléeLe);
  this.statut = StatutTâchePlanifiée.annulée;
}
