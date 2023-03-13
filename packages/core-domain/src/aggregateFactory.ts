import { DomainEvent } from './domainEvent';

export type AggregateFactory<TState> = (events: ReadonlyArray<DomainEvent>) => TState;
