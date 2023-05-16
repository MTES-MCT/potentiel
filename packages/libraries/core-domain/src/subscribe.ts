import { DomainEvent } from './domainEvent';
import { DomainEventHandler } from './domainEventHandler';

export type Unsubscribe = () => Promise<void>;

export type Subscribe = <TDomainEvent extends DomainEvent>(
  eventType: TDomainEvent['type'] | 'all',
  eventHandler: DomainEventHandler<TDomainEvent>,
) => Unsubscribe;
