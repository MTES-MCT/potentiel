import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as TypeTâche from '../typeTâche.valueType';
import { TâcheAggregate } from '../tâche.aggregate';

export type TâchePlanifiéeEvent = DomainEvent<
  'TâchePlanifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    typeTâche: TypeTâche.RawType;
    ajoutéeLe: DateTime.RawType;
    àExecuterLe: DateTime.RawType;
  }
>;

export type PlanifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâche: TypeTâche.ValueType;
  àExecuterLe: DateTime.ValueType;
};

export async function planifier(
  this: TâcheAggregate,
  { identifiantProjet, typeTâche, àExecuterLe }: PlanifierOptions,
) {
  const event: TâchePlanifiéeEvent = {
    type: 'TâchePlanifiée-V1',
    payload: {
      ajoutéeLe: DateTime.now().formatter(),
      identifiantProjet: identifiantProjet.formatter(),
      typeTâche: typeTâche.type,
      àExecuterLe: àExecuterLe.formatter(),
    },
  };
  await this.publish(event);
}

export function applyTâchePlanifiée(
  this: TâcheAggregate,
  { payload: { typeTâche: type, àExecuterLe } }: TâchePlanifiéeEvent,
) {
  this.typeTâche = TypeTâche.convertirEnValueType(type);
  this.achevée = false;
  this.àExecuterLe = DateTime.convertirEnValueType(àExecuterLe);
}
