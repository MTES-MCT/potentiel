import { DomainEvent } from './domainEvent';

export type AggregateStateFactory<TAggregateState, TDomainEvent extends DomainEvent> = (
  events: ReadonlyArray<TDomainEvent>,
) => TAggregateState;
