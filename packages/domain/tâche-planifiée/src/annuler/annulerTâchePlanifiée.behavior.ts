import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as StatutTâchePlanifiée from '../statutTâchePlanifiée.valueType';
import * as TypePlanifiéeTâche from '../typeTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';

export type TâchePlanifiéeAnnuléeEvent = DomainEvent<
  'TâchePlanifiéeAnnulée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: TypePlanifiéeTâche.RawType;
    annuléeLe: DateTime.RawType;
  }
>;

export type AnnulerOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: TypePlanifiéeTâche.ValueType;
};

export async function annuler(
  this: TâchePlanifiéeAggregate,
  { identifiantProjet, typeTâchePlanifiée }: AnnulerOptions,
) {
  if (this.statut.estÉgaleÀ(StatutTâchePlanifiée.enAttenteExécution)) {
    const event: TâchePlanifiéeAnnuléeEvent = {
      type: 'TâchePlanifiéeAnnulée-V1',
      payload: {
        annuléeLe: DateTime.now().formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        typeTâchePlanifiée: typeTâchePlanifiée.type,
      },
    };
    await this.publish(event);
  }
}

export function applyTâchePlanifiéeAnnulée(
  this: TâchePlanifiéeAggregate,
  { payload: { typeTâchePlanifiée, annuléeLe } }: TâchePlanifiéeAnnuléeEvent,
) {
  this.typeTâche = TypePlanifiéeTâche.convertirEnValueType(typeTâchePlanifiée);
  this.annuléeLe = DateTime.convertirEnValueType(annuléeLe);
  this.statut = StatutTâchePlanifiée.annulée;
}
