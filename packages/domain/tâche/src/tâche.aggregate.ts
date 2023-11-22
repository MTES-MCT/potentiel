import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import * as TypeTâche from './typeTâche.valueType';
import {
  TâcheRenouvelléeEvent,
  TâcheAjoutéeEvent,
  ajouter,
  applyTâcheRelancée,
  TâcheRelancéeEvent,
} from './ajouter/ajouterTâche.behavior';
import {
  TâcheSuppriméeEvent,
  applyTâcheSupprimée,
  supprimer,
} from './supprimer/supprimerTâche.behavior';
import { TâcheInconnueError } from './tâcheInconnue.error';

export type TâcheEvent =
  | TâcheAjoutéeEvent
  | TâcheRenouvelléeEvent
  | TâcheRelancéeEvent
  | TâcheSuppriméeEvent;

export type TâcheAggregate = Aggregate<TâcheEvent> & {
  type: TypeTâche.ValueType;
  achevée: boolean;
  ajouter: typeof ajouter;
  supprimer: typeof supprimer;
};

export const getDefaultAbandonAggregate: GetDefaultAggregateState<
  TâcheAggregate,
  TâcheEvent
> = () => ({
  apply,
  type: TypeTâche.convertirEnValueType('inconnu'),
  achevée: false,
  ajouter,
  supprimer,
});

function apply(this: TâcheAggregate, event: TâcheEvent) {
  switch (event.type) {
    case 'TâcheAjoutée-V1':
      applyTâcheRelancée.bind(this)(event);
      break;
    case 'TâcheSupprimée-V1':
      applyTâcheSupprimée.bind(this)(event);
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
