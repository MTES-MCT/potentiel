import { DomainEvent } from './domainEvent';

export type AggregateFactory<TState, TDomainEvent extends DomainEvent> = (
  events: ReadonlyArray<TDomainEvent>,
) => TState;
