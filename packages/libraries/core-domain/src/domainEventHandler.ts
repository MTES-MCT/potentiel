import { DomainEvent } from './domainEvent';

export type DomainEventHandler<TDomainEvent extends DomainEvent> = (
  domainEvent: TDomainEvent,
) => Promise<void>;
