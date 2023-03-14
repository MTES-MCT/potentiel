import {
  AggregateId,
  AggregateStateFactory,
  DomainEvent,
  LoadAggregate,
  none,
} from '@potentiel/core-domain';
import { loadFromStream } from './loadFromStream';

export const loadAggregate: LoadAggregate = async <
  TAggregateState,
  TDomainEvent extends DomainEvent,
>(
  aggregateId: AggregateId,
  aggregateFactory: AggregateStateFactory<TAggregateState, TDomainEvent>,
) => {
  const events = await loadFromStream(aggregateId);

  if (!events.length) {
    return none;
  }

  const version = events[events.length - 1].version;
  const domainEvents = events.map<TDomainEvent>(
    ({ type, payload }) => ({ type, payload } as TDomainEvent),
  );

  return {
    ...aggregateFactory(domainEvents),
    aggregateId,
    version,
  };
};
