import { Aggregate } from './aggregate';
import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type AggregateFactory = (
  aggregateId: AggregateId,
  events: ReadonlyArray<DomainEvent>,
) => Aggregate;
