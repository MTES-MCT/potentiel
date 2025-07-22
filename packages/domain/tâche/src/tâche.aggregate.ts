import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import * as TypeTâche from './typeTâche.valueType';
import {
  TâcheRenouvelléeEvent,
  TâcheAjoutéeEvent,
  ajouter,
  applyTâcheRenouvellée,
  applyTâcheAjoutée,
  TâcheRelancéeEvent,
} from './ajouter/ajouterTâche.behavior';
import { TâcheAchevéeEvent, applyTâcheAchevée, achever } from './achever/acheverTâche.behavior';
import { TâcheInconnueError } from './tâcheInconnue.error';

export type TâcheEvent =
  | TâcheAjoutéeEvent
  | TâcheRenouvelléeEvent
  | TâcheRelancéeEvent
  | TâcheAchevéeEvent;

export type TâcheAggregate = Aggregate<TâcheEvent> & {
  typeTâche: TypeTâche.ValueType;
  achevée: boolean;
  ajouter: typeof ajouter;
  achever: typeof achever;
};

export const getDefaultAbandonAggregate: GetDefaultAggregateState<
  TâcheAggregate,
  TâcheEvent
> = () => ({
  apply,
  typeTâche: TypeTâche.convertirEnValueType('inconnue'),
  achevée: false,
  ajouter,
  achever,
});

function apply(this: TâcheAggregate, event: TâcheEvent) {
  switch (event.type) {
    case 'TâcheAjoutée-V1':
      applyTâcheAjoutée.bind(this)(event);
      break;
    case 'TâcheAchevée-V1':
      applyTâcheAchevée.bind(this)(event);
      break;
    case 'TâcheRenouvellée-V1':
      applyTâcheRenouvellée.bind(this)(event);
      break;
  }
}

export const loadTâcheAggregateFactory =
  (loadAggregate: LoadAggregate) =>
  (
    { type }: TypeTâche.ValueType,
    identifiantProjet: IdentifiantProjet.ValueType,
    throwOnNone = true,
  ) => {
    return loadAggregate({
      aggregateId: `tâche|${type}#${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultAbandonAggregate,
      onNone: throwOnNone
        ? () => {
            throw new TâcheInconnueError(type, identifiantProjet.formatter());
          }
        : undefined,
    });
  };
