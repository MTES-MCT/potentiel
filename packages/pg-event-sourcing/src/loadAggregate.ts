import { LoadAggregate, none } from '@potentiel/core-domain';
import { loadFromStream } from './loadFromStream';

export const loadAggregate: LoadAggregate = async (aggregateId, aggregateFactory) => {
  const events = await loadFromStream(aggregateId);

  if (!events.length) {
    return none;
  }

  const version = events[events.length - 1].version;
  const domainEvents = events.map(({ type, payload }) => ({ type, payload }));

  return {
    ...aggregateFactory(domainEvents),
    aggregateId,
    version,
  };
};
