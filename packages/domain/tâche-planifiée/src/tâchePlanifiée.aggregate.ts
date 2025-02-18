import { Aggregate, AggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as StatutTâchePlanifiée from './statutTâchePlanifiée.valueType';
import {
  TâchePlanifiéeAjoutéeEvent,
  applyTâchePlanifiéeAjoutée,
} from './ajouter/ajouterTâchePlanifiée.behavior';
import { ajouter } from './ajouter/ajouterTâchePlanifiée.behavior';
import { TâchePlanifiéeInconnueError } from './tâchePlanifiéeInconnue.error';
import {
  TâchePlanifiéeAnnuléeEvent,
  annuler,
  applyTâchePlanifiéeAnnulée,
} from './annuler/annulerTâchePlanifiée.behavior';
import {
  TâchePlanifiéeExecutéeEvent,
  applyTâchePlanifiéeExecutée,
  exécuter,
} from './exécuter/exécuterTâchePlanifiée.behavior';

export type TâchePlanifiéeEvent =
  | TâchePlanifiéeAjoutéeEvent
  | TâchePlanifiéeAnnuléeEvent
  | TâchePlanifiéeExecutéeEvent;

export type TâchePlanifiéeAggregate = Aggregate<TâchePlanifiéeEvent> & {
  readonly identifiantProjet: IdentifiantProjet.ValueType;
  readonly typeTâchePlanifiée: string;
  statut: StatutTâchePlanifiée.ValueType;
  àExécuterLe: DateTime.ValueType;
  annuléeLe?: DateTime.ValueType;
  ajouter: typeof ajouter;
  annuler: typeof annuler;
  exécuter: typeof exécuter;
};

export const getDefaultTâchePlanifiéeAggregate = (
  typeTâchePlanifiée: string,
  identifiantProjet: IdentifiantProjet.ValueType,
): AggregateState<TâchePlanifiéeAggregate, TâchePlanifiéeEvent> => ({
  apply,
  statut: StatutTâchePlanifiée.inconnu,
  identifiantProjet,
  typeTâchePlanifiée: typeTâchePlanifiée,
  àExécuterLe: DateTime.now(),
  ajouter,
  annuler,
  exécuter,
});

function apply(this: TâchePlanifiéeAggregate, event: TâchePlanifiéeEvent) {
  switch (event.type) {
    case 'TâchePlanifiéeAjoutée-V1':
      applyTâchePlanifiéeAjoutée.bind(this)(event);
      break;
    case 'TâchePlanifiéeAnnulée-V1':
      applyTâchePlanifiéeAnnulée.bind(this)(event);
      break;
    case 'TâchePlanifiéeExecutée-V1':
      applyTâchePlanifiéeExecutée.bind(this)(event);
      break;
  }
}

export const loadTâchePlanifiéeAggregateFactory =
  (loadAggregate: LoadAggregate) =>
  (type: string, identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `tâche-planifiée|${type}#${identifiantProjet.formatter()}`,
      getDefaultAggregate: () => getDefaultTâchePlanifiéeAggregate(type, identifiantProjet),
      onNone: throwOnNone
        ? () => {
            throw new TâchePlanifiéeInconnueError(type, identifiantProjet.formatter());
          }
        : undefined,
    });
  };
