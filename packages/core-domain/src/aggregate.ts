import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type Aggregate = { aggregateId: AggregateId; pendingEvents: DomainEvent[] };
