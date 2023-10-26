import { DomainEvent } from './domainEvent';
import { LoadAggregate } from './loadAggregate';

/**
 * @deprecated
 */
export type AggregateFactory<
  TAggregate extends Record<string, unknown>,
  TDomainEvent extends DomainEvent,
> = (events: ReadonlyArray<TDomainEvent>, loadAggregate: LoadAggregate) => TAggregate;
