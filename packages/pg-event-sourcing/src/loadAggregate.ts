import { LoadAggregate } from '@potentiel/core-domain';
import { loadFromStream } from './loadFromStream';

export const loadAggregate: LoadAggregate = async (aggregateId) => {
  const events = await loadFromStream(aggregateId);

  if (!events.length) {
    return undefined;
  }

  return {
    aggregateId,
    version: events.length,
  };
};
