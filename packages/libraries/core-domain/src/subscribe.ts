import { DomainEvent } from './domainEvent';

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Unsubscribe = () => Promise<void>;

/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type Subscriber<TDomainEvent extends DomainEvent = DomainEvent> = {
  name: string;
  eventType: TDomainEvent['type'] | ReadonlyArray<TDomainEvent['type']> | 'all';
  eventHandler: (event: TDomainEvent) => Promise<void>;
  streamCategory: string;
};

export type Subscribe = <TDomainEvent extends DomainEvent>(
  subscriber: Subscriber<TDomainEvent>,
) => Promise<Unsubscribe>;
