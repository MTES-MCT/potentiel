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

export type LauréatEvent = LauréatNotifiéEvent;

export type LauréatAggregate = Aggregate<LauréatEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  nomProjet: string;
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    région: string;
    département: string;
  };
  notifier: typeof notifier;
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
    région: '',
    département: '',
  },
  apply,
  notifier,
});

function apply(this: LauréatAggregate, event: LauréatEvent) {
  switch (event.type) {
    case 'LauréatNotifié-V2':
      applyLauréatNotifié.bind(this)(event);
      break;
  }
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
