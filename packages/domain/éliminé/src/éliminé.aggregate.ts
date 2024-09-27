import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import {
  ÉliminéNotifiéEvent,
  applyÉliminéNotifié,
  notifier,
} from './notifier/notifierÉliminé.behavior';
import {
  archiver,
  ÉliminéArchivéEvent,
  applyÉliminéArchivé,
} from './archiver/archiverÉliminé.behavior';

export type ÉliminéEvent = ÉliminéNotifiéEvent | ÉliminéArchivéEvent;

export type ÉliminéAggregate = Aggregate<ÉliminéEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  estArchivé: boolean;
  archiver: typeof archiver;
  notifier: typeof notifier;
};

export const getDefaultÉliminéAggregate: GetDefaultAggregateState<
  ÉliminéAggregate,
  ÉliminéEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  estArchivé: false,
  apply,
  notifier,
  archiver,
});

function apply(this: ÉliminéAggregate, event: ÉliminéEvent) {
  switch (event.type) {
    case 'ÉliminéNotifié-V1':
      applyÉliminéNotifié.bind(this)(event);
      break;
    case 'ÉliminéArchivé-V1':
      applyÉliminéArchivé.bind(this)(event);
      break;
  }
}

export const loadÉliminéFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `éliminé|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultÉliminéAggregate,
      onNone: throwOnNone
        ? () => {
            throw new ÉliminéNonTrouvéError();
          }
        : undefined,
    });
  };

class ÉliminéNonTrouvéError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet éliminé n'existe pas`);
  }
}
