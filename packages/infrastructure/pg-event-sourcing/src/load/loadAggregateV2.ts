import {
  AbstractAggregate,
  AggregateId,
  DomainEvent,
  LoadAggregateV2,
  Publish,
} from '@potentiel-domain/core';

import { publish } from '../publish/publish';

import { loadFromStream } from './loadFromStream';

export const loadAggregateV2: LoadAggregateV2 = async <
  TDomainEvent extends DomainEvent,
  TAggregate extends AbstractAggregate<TDomainEvent, string>,
>(
  ctor: new (
    parent: TAggregate['parent'],
    aggregateId: AggregateId,
    version: number,
    publish: Publish,
    loadAggregate: LoadAggregateV2,
  ) => TAggregate,
  aggregateId: AggregateId,
  parent: TAggregate['parent'],
) => {
  const events = await loadFromStream({
    streamId: aggregateId,
  });
  const version = events.length === 0 ? 0 : events[events.length - 1].version;

  const aggregate = new ctor(parent, aggregateId, version, publish, loadAggregateV2);

  const domainEvents = events.map<TDomainEvent>(
    ({ type, payload }) => ({ type, payload }) as TDomainEvent,
  );

  for (const domainEvent of domainEvents) {
    aggregate.apply(domainEvent);
  }
  return aggregate;
};
