import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as TypeTâchePlanifiée from './typeTâchePlanifiée.valueType';
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

export type TâchePlanifiéeEvent = TâchePlanifiéeAjoutéeEvent | TâchePlanifiéeAnnuléeEvent;

export type TâchePlanifiéeAggregate = Aggregate<TâchePlanifiéeEvent> & {
  statut: StatutTâchePlanifiée.ValueType;
  typeTâche: TypeTâchePlanifiée.ValueType;
  àExécuterLe: DateTime.ValueType;
  annuléeLe?: DateTime.ValueType;
  ajouter: typeof ajouter;
  annuler: typeof annuler;
};

export const getDefaultTâchePlanifiéeAggregate: GetDefaultAggregateState<
  TâchePlanifiéeAggregate,
  TâchePlanifiéeEvent
> = () => ({
  statut: StatutTâchePlanifiée.inconnu,
  apply,
  typeTâche: TypeTâchePlanifiée.convertirEnValueType('inconnue'),
  àExécuterLe: DateTime.now(),
  ajouter,
  annuler,
});

function apply(this: TâchePlanifiéeAggregate, event: TâchePlanifiéeEvent) {
  switch (event.type) {
    case 'TâchePlanifiéeAjoutée-V1':
      applyTâchePlanifiéeAjoutée.bind(this)(event);
      break;
    case 'TâchePlanifiéeAnnulée-V1':
      applyTâchePlanifiéeAnnulée.bind(this)(event);
      break;
  }
}

export const loadTâchePlanifiéeAggregateFactory =
  (loadAggregate: LoadAggregate) =>
  (
    { type }: TypeTâchePlanifiée.ValueType,
    identifiantProjet: IdentifiantProjet.ValueType,
    throwOnNone = true,
  ) => {
    return loadAggregate({
      aggregateId: `tâche-planifiée|${type}#${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultTâchePlanifiéeAggregate,
      onNone: throwOnNone
        ? () => {
            throw new TâchePlanifiéeInconnueError(type, identifiantProjet.formatter());
          }
        : undefined,
    });
  };
