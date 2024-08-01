import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

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
  typeTâche: string;
  achevée: boolean;
  ajouter: typeof ajouter;
  achever: typeof achever;
};

export const getDefaultAbandonAggregate: GetDefaultAggregateState<
  TâcheAggregate,
  TâcheEvent
> = () => ({
  apply,
  typeTâche: 'inconnue',
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
  (typeTâche: string, identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `tâche|${typeTâche}#${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultAbandonAggregate,
      onNone: throwOnNone
        ? () => {
            throw new TâcheInconnueError(typeTâche, identifiantProjet.formatter());
          }
        : undefined,
    });
  };
