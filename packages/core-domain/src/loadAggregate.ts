import { Aggregate } from './aggregate';
import { AggregateStateFactory } from './aggregateStateFactory';
import { AggregateId } from './aggregateId';
import { Option } from './helpers/option';
import { DomainEvent } from './domainEvent';

export type LoadAggregate = <TAggregateState, TDomainEvent extends DomainEvent>(
  aggregateId: AggregateId,
  aggregateStateFactory: AggregateStateFactory<TAggregateState, TDomainEvent>,
) => Promise<Option<Aggregate & TAggregateState>>;
