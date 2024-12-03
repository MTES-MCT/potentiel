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
  applyActionnaireImporté,
  importerActionnaire,
  ActionnaireLauréatImportéEvent,
} from './importerActionnaire/importerActionnaire.behavior';

export type LauréatEvent = LauréatNotifiéEvent | ActionnaireLauréatImportéEvent;

export type LauréatAggregate = Aggregate<LauréatEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  actionnaire: String;
  notifier: typeof notifier;
  importerActionnaire: typeof importerActionnaire;
};

export const getDefaultLauréatAggregate: GetDefaultAggregateState<
  LauréatAggregate,
  LauréatEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  notifiéLe: DateTime.now(),
  actionnaire: '',
  apply,
  notifier,
  importerActionnaire,
});

function apply(this: LauréatAggregate, event: LauréatEvent) {
  switch (event.type) {
    case 'LauréatNotifié-V1':
      applyLauréatNotifié.bind(this)(event);
      break;
    case 'ActionnaireLauréatImporté-V1':
      applyActionnaireImporté.bind(this)(event);
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
