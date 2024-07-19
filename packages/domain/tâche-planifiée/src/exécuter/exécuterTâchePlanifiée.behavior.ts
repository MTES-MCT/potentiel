import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import * as TâchePlanifiéeType from '../typeTâchePlanifiée.valueType';
import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';
import * as StatutTâchePlanifiée from '../statutTâchePlanifiée.valueType';

export type TâchePlanifiéeExecutéeEvent = DomainEvent<
  'TâchePlanifiéeExecutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    exécutéeLe: DateTime.RawType;
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
  if (this.statut.estAnnulé()) {
    throw new TâcheAnnuléeError(identifiantProjet, typeTâchePlanifiée);
  }
  if (this.statut.estExécuté()) {
    throw new TâcheDéjàExécutéeError(identifiantProjet, typeTâchePlanifiée);
  }
  const event: TâchePlanifiéeExecutéeEvent = {
    type: 'TâchePlanifiéeExecutée-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      exécutéeLe: DateTime.now().formatter(),
      typeTâchePlanifiée: typeTâchePlanifiée.type,
    },
  };
  await this.publish(event);
}

export function applyTâchePlanifiéeExecutée(
  this: TâchePlanifiéeAggregate,
  _: TâchePlanifiéeExecutéeEvent,
) {
  this.statut = StatutTâchePlanifiée.exécutée;
}

class TâcheDéjàExécutéeError extends InvalidOperationError {
  constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    typeTâchePlanifiée: TâchePlanifiéeType.ValueType,
  ) {
    super('La tâche planifiée est déjà executée', {
      identifiantProjet,
      typeTâchePlanifiée,
    });
  }
}

class TâcheAnnuléeError extends InvalidOperationError {
  constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    typeTâchePlanifiée: TâchePlanifiéeType.ValueType,
  ) {
    super('La tâche planifiée est annulée', {
      identifiantProjet,
      typeTâchePlanifiée,
    });
  }
}
