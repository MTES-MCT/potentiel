import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';

import { TâchePlanifiéeAggregate } from '../tâchePlanifiée.aggregate';
import * as StatutTâchePlanifiée from '../statutTâchePlanifiée.valueType';

export type TâchePlanifiéeExecutéeEvent = DomainEvent<
  'TâchePlanifiéeExecutée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    exécutéeLe: DateTime.RawType;
    typeTâchePlanifiée: string;
  }
>;

export type ExécuterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typeTâchePlanifiée: string;
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
      typeTâchePlanifiée,
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
  constructor(identifiantProjet: IdentifiantProjet.ValueType, typeTâchePlanifiée: string) {
    super('La tâche planifiée est déjà exécutée', {
      identifiantProjet,
      typeTâchePlanifiée,
    });
  }
}

class TâcheAnnuléeError extends InvalidOperationError {
  constructor(identifiantProjet: IdentifiantProjet.ValueType, typeTâchePlanifiée: string) {
    super('La tâche planifiée est annulée', {
      identifiantProjet,
      typeTâchePlanifiée,
    });
  }
}
