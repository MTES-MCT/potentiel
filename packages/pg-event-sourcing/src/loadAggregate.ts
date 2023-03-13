import { LoadAggregate, none } from '@potentiel/core-domain';
import { loadFromStream } from './loadFromStream';

export const loadAggregate: LoadAggregate = async (aggregateId, aggregateFactory) => {
  const events = await loadFromStream(aggregateId);

  if (!events.length) {
    return none;
  }

  return { ...aggregateFactory(events), aggregateId, version: events.length };
};
