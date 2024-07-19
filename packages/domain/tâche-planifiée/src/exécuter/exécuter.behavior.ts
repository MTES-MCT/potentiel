import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import * as TâchePlanifiéeType from '../typeTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';
import * as StatutTâchePlanifiée from '../statutTâchePlanifiée.valueType';

export type TâchePlanifiéeExecutéeEvent = DomainEvent<
  'TâchePlanifiéeExecutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    executéeLe: DateTime.RawType;
    typeTâchePlanifiée: TâchePlanifiéeType.RawType;
  }
>;

export type ExécuterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: TâchePlanifiéeType.ValueType;
};

export async function exécuter(
  this: TâchePlanifiéeAggregate,
  { identifiantProjet, typeTâchePlanifiée }: ExécuterOptions,
) {
  // if(!this.statut.estExécutée()){
  const event: TâchePlanifiéeExecutéeEvent = {
    type: 'TâchePlanifiéeExecutée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      executéeLe: DateTime.now().formatter(),
      typeTâchePlanifiée: typeTâchePlanifiée.type,
    },
  };
  await this.publish(event);
  //}
}

export function applyTâchePlanifiéeExecutée(
  this: TâchePlanifiéeAggregate,
  _: TâchePlanifiéeExecutéeEvent,
) {
  this.statut = StatutTâchePlanifiée.exécutée;
}
