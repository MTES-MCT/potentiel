import { DomainEvent } from '@potentiel/core-domain';

export type Unsubscribe = () => Promise<void>;

export type Subscribe = <TDomainEvent extends DomainEvent>(
  eventType: TDomainEvent['type'] | ReadonlyArray<TDomainEvent['type']> | 'all',
  eventHandler: (event: TDomainEvent) => Promise<void>,
) => Unsubscribe;
