import { DomainEvent } from './domainEvent';

export type Unsubscribe = () => Promise<void>;

export type Subscriber<TDomainEvent extends DomainEvent = DomainEvent> = {
  name: string;
  eventType: TDomainEvent['type'] | ReadonlyArray<TDomainEvent['type']> | 'all';
  eventHandler: (event: TDomainEvent) => Promise<void>;
};

export type Subscribe = <TDomainEvent extends DomainEvent>(
  subscriber: Subscriber<TDomainEvent>,
) => Promise<Unsubscribe>;
