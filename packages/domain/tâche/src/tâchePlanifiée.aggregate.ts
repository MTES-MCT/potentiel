import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import * as TypeTâchePlanifiée from './typeTâchePlanifiée.valueType';
import {
  TâchePlanifiéeAjoutéeEvent,
  applyTâchePlanifiée,
} from './planifier/planifierTâche.behavior';
import { planifier } from './planifier/planifierTâche.behavior';
import { TâchePlanifiéeInconnueError } from './tâchePlanifiéeInconnue.error';

export type TâchePlanifiéeEvent = TâchePlanifiéeAjoutéeEvent;

export type TâchePlanifiéeAggregate = Aggregate<TâchePlanifiéeEvent> & {
  typeTâche: TypeTâchePlanifiée.ValueType;
  àExecuterLe: DateTime.ValueType;
  planifier: typeof planifier;
};

export const getDefaultTâchePlanifiéeAggregate: GetDefaultAggregateState<
  TâchePlanifiéeAggregate,
  TâchePlanifiéeEvent
> = () => ({
  apply,
  typeTâche: TypeTâchePlanifiée.convertirEnValueType('inconnue'),
  àExecuterLe: DateTime.now(),
  planifier,
});

function apply(this: TâchePlanifiéeAggregate, event: TâchePlanifiéeEvent) {
  switch (event.type) {
    case 'TâchePlanifiéeAjoutée-V1':
      applyTâchePlanifiée.bind(this)(event);
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
