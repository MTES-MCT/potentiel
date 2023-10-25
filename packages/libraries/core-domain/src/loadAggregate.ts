import { Option } from '@potentiel/monads';
import { Aggregate } from './aggregate';
import { AggregateFactory } from './aggregateFactory';
import { AggregateId } from './aggregateId';
import { DomainEvent } from './domainEvent';

export type LoadAggregate = <
  TAggregate extends Record<string, unknown>,
  TDomainEvent extends DomainEvent,
>(
  aggregateId: AggregateId,
  aggregateStateFactory: AggregateFactory<TAggregate, TDomainEvent>,
) => Promise<Option<Aggregate & TAggregate>>;
