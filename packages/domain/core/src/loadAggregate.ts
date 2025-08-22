import type { Aggregate, AggregateState } from './aggregate';
import type { AggregateId } from './aggregateId';
import type { DomainEvent } from './domainEvent';

export type GetDefaultAggregateState<
  TAggregate extends Aggregate<TDomainEvent>,
  TDomainEvent extends DomainEvent,
> = () => AggregateState<TAggregate, TDomainEvent>;

export type LoadAggregateOption<
  TAggregate extends Aggregate<TDomainEvent>,
  TDomainEvent extends DomainEvent,
> = {
  aggregateId: AggregateId;
  getDefaultAggregate: GetDefaultAggregateState<TAggregate, TDomainEvent>;
  onNone?: () => void;
};

export type LoadAggregate = <
  TAggregate extends Aggregate<TDomainEvent>,
  TDomainEvent extends DomainEvent,
>(
  option: LoadAggregateOption<TAggregate, TDomainEvent>,
) => Promise<TAggregate>;
