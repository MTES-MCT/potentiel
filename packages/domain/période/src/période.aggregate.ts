import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import * as IdentifiantPériode from './identifiantPériode.valueType';
import {
  applyPériodeNotifiée,
  notifier,
  PériodeNotifiéeEvent,
} from './notifier/notifierPériode.behavior';

export type PériodeEvent = PériodeNotifiéeEvent;

export type PériodeAggregate = Aggregate<PériodeEvent> & {
  identifiantPériode: IdentifiantPériode.ValueType | Option.None;
  lauréats: ReadonlyArray<IdentifiantProjet.ValueType>;
  éliminés: ReadonlyArray<IdentifiantProjet.ValueType>;
  readonly notifier: typeof notifier;
};

export const getDefaultPériodeAggregate: GetDefaultAggregateState<
  PériodeAggregate,
  PériodeEvent
> = () => ({
  identifiantPériode: Option.none,
  lauréats: [],
  éliminés: [],
  apply,
  notifier,
});

function apply(this: PériodeAggregate, event: PériodeEvent) {
  switch (event.type) {
    case 'PériodeNotifiée-V1':
      applyPériodeNotifiée.bind(this)(event);
      break;
  }
}

export const loadPériodeFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantPériode: IdentifiantPériode.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `période|${identifiantPériode.formatter()}`,
      getDefaultAggregate: getDefaultPériodeAggregate,
      onNone: throwOnNone
        ? () => {
            throw new PériodeInconnueError(identifiantPériode.formatter());
          }
        : undefined,
    });
  };

class PériodeInconnueError extends AggregateNotFoundError {
  constructor(identifiantPériode: IdentifiantPériode.RawType) {
    super(`La période n'existe pas`, { identifiantPériode });
  }
}
