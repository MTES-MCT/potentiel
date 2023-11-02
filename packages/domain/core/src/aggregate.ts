import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type AggregateState<
  TAggregate extends Aggregate<TDomainEvent>,
  TDomainEvent extends DomainEvent,
> = Omit<TAggregate, 'aggregateId' | 'version' | 'publish'>;

export type Aggregate<TDomainEvent extends DomainEvent> = {
  aggregateId: AggregateId;
  version: number;
  apply(event: TDomainEvent): void;
  publish(event: TDomainEvent): Promise<void>;
};
