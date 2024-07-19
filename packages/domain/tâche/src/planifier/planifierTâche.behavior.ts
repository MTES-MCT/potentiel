import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as TypePlanifiéeTâche from '../typeTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';

export type TâchePlanifiéeAjoutéeEvent = DomainEvent<
  'TâchePlanifiéeAjoutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâchePlanifiée: TypePlanifiéeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
    àExécuterLe: DateTime.RawType;
  }
>;

export type PlanifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: TypePlanifiéeTâche.ValueType;
  àExecuterLe: DateTime.ValueType;
};

export async function planifier(
  this: TâchePlanifiéeAggregate,
  { identifiantProjet, typeTâchePlanifiée, àExecuterLe }: PlanifierOptions,
) {
  if (!this.àExecuterLe.estÉgaleÀ(àExecuterLe)) {
    const event: TâchePlanifiéeAjoutéeEvent = {
      type: 'TâchePlanifiéeAjoutée-V1',
      payload: {
        ajoutéeLe: DateTime.now().formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        typeTâchePlanifiée: typeTâchePlanifiée.type,
        àExécuterLe: àExecuterLe.formatter(),
      },
    };
    await this.publish(event);
  }
}

export function applyTâchePlanifiée(
  this: TâchePlanifiéeAggregate,
  { payload: { typeTâchePlanifiée: type, àExécuterLe } }: TâchePlanifiéeAjoutéeEvent,
) {
  this.typeTâche = TypePlanifiéeTâche.convertirEnValueType(type);
  this.àExecuterLe = DateTime.convertirEnValueType(àExécuterLe);
}
