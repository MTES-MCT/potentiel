import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type AggregateState<
  TAggregate extends Aggregate<TDomainEvent>,
  TDomainEvent extends DomainEvent,
> = Omit<TAggregate, 'aggregateId' | 'version' | 'exists' | 'publish'>;

export interface Aggregate<TDomainEvent extends DomainEvent> {
  aggregateId: AggregateId;
  version: number;
  exists: boolean;
  apply(event: TDomainEvent): void;
  publish(event: TDomainEvent): Promise<void>;
}
