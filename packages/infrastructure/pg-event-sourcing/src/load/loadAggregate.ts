import { Aggregate, DomainEvent, LoadAggregate, LoadAggregateOption } from '@potentiel-domain/core';

import { publish } from '../publish/publish';

import { loadFromStream } from './loadFromStream';

export const loadAggregate: LoadAggregate = async <
  TAggregate extends Aggregate<TDomainEvent>,
  TDomainEvent extends DomainEvent,
>({
  aggregateId,
  getDefaultAggregate,
  onNone,
}: LoadAggregateOption<TAggregate, TDomainEvent>) => {
  const events = await loadFromStream({
    streamId: aggregateId,
  });

  const aggregate = {
    ...getDefaultAggregate(),
    aggregateId,
    version: 0,
    async publish(event) {
      await publish(aggregateId, event);
      this.apply(event);
      this.version++;
    },
  } as TAggregate;

  if (!events.length) {
    onNone && onNone();
    return aggregate;
  }

  const version = events[events.length - 1].version;
  const domainEvents = events.map<TDomainEvent>(
    ({ type, payload }) => ({ type, payload }) as TDomainEvent,
  );

  for (const domainEvent of domainEvents) {
    aggregate.apply(domainEvent);
  }

  return {
    ...aggregate,
    version,
  } as TAggregate;
};
