import { match } from 'ts-pattern';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import {
  LauréatNotifiéEvent,
  applyLauréatNotifié,
  notifier,
} from './notifier/notifierLauréat.behavior';
import {
  LauréatModifiéEvent,
  modifier,
  applyLauréatModifié,
} from './modifier/modifierLauréat.behavior';

export type LauréatEvent = LauréatNotifiéEvent | LauréatModifiéEvent;

export type LauréatAggregate = Aggregate<LauréatEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  nomProjet: string;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    département: string;
    région: string;
  };
  notifier: typeof notifier;
  modifier: typeof modifier;
};

export const getDefaultLauréatAggregate: GetDefaultAggregateState<
  LauréatAggregate,
  LauréatEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  notifiéLe: DateTime.now(),
  nomProjet: '',
  localité: {
    adresse1: '',
    adresse2: '',
    codePostal: '',
    commune: '',
    département: '',
    région: '',
  },
  apply,
  notifier,
  modifier,
});

function apply(this: LauréatAggregate, event: LauréatEvent) {
  match(event)
    .with({ type: 'LauréatNotifié-V2' }, applyLauréatNotifié.bind(this))
    .with({ type: 'LauréatModifié-V1' }, applyLauréatModifié.bind(this))
    .exhaustive();
}

export const loadLauréatFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `lauréat|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultLauréatAggregate,
      onNone: throwOnNone
        ? () => {
            throw new LauréatNonTrouvéError();
          }
        : undefined,
    });
  };

class LauréatNonTrouvéError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet lauréat n'existe pas`);
  }
}
