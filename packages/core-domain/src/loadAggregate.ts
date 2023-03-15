import { Option } from '@potentiel/monads';
import { Aggregate } from './aggregate';
import { AggregateStateFactory } from './aggregateStateFactory';
import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type LoadAggregate = <TAggregateState, TDomainEvent extends DomainEvent>(
  aggregateId: AggregateId,
  aggregateStateFactory: AggregateStateFactory<TAggregateState, TDomainEvent>,
) => Promise<Option<Aggregate & TAggregateState>>;
