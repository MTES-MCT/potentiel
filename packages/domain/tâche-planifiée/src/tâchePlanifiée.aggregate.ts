import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as TypeTâchePlanifiée from './typeTâchePlanifiée.valueType';
import {
  TâchePlanifiéeAjoutéeEvent,
  applyTâchePlanifiéeAjoutée,
} from './ajouter/ajouterTâchePlanifiée.behavior';
import { ajouter } from './ajouter/ajouterTâchePlanifiée.behavior';
import { TâchePlanifiéeInconnueError } from './tâchePlanifiéeInconnue.error';

export type TâchePlanifiéeEvent = TâchePlanifiéeAjoutéeEvent;

export type TâchePlanifiéeAggregate = Aggregate<TâchePlanifiéeEvent> & {
  typeTâche: TypeTâchePlanifiée.ValueType;
  àExécuterLe: DateTime.ValueType;
  ajouter: typeof ajouter;
};

export const getDefaultTâchePlanifiéeAggregate: GetDefaultAggregateState<
  TâchePlanifiéeAggregate,
  TâchePlanifiéeEvent
> = () => ({
  apply,
  typeTâche: TypeTâchePlanifiée.convertirEnValueType('inconnue'),
  àExécuterLe: DateTime.now(),
  ajouter,
});

function apply(this: TâchePlanifiéeAggregate, event: TâchePlanifiéeEvent) {
  switch (event.type) {
    case 'TâchePlanifiéeAjoutée-V1':
      applyTâchePlanifiéeAjoutée.bind(this)(event);
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
