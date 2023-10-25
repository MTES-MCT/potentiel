import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type Publish = (
  aggregateId: AggregateId,
  ...events: ReadonlyArray<DomainEvent>
) => Promise<void>;
