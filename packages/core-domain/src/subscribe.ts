import { DomainEvent } from './domainEvent';
import { DomainEventHandler } from './domainEventHandler';

export type Subscribe = <TDomainEvent extends DomainEvent>(
  eventType: TDomainEvent['type'] | 'all',
  eventHandler: DomainEventHandler<TDomainEvent>,
) => Promise<void>;
