import {
  AbstractAggregate,
  AggregateId,
  DomainEvent,
  LoadAggregate,
  Publish,
} from '@potentiel-domain/core';

import { publish } from '../publish/publish';

import { loadFromStream } from './loadFromStream';

export const loadAggregate: LoadAggregate = async <
  TDomainEvent extends DomainEvent,
  TAggregate extends AbstractAggregate<TDomainEvent, string>,
>(
  ctor: new (
    parent: TAggregate['parent'],
    aggregateId: AggregateId,
    version: number,
    publish: Publish,
    loadAggregate: LoadAggregate,
  ) => TAggregate,
  aggregateId: AggregateId,
  parent: TAggregate['parent'],
) => {
  const events = await loadFromStream<TDomainEvent>({
    streamId: aggregateId,
  });
  const version = events.length === 0 ? 0 : events[events.length - 1].version;

  const aggregate = new ctor(parent, aggregateId, version, publish, loadAggregate);

  const domainEvents = events.map(({ type, payload }) => ({ type, payload }) as TDomainEvent);

  for (const domainEvent of domainEvents) {
    aggregate.apply(domainEvent);
  }
  return aggregate;
};
