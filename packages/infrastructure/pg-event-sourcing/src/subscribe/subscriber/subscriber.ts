import { DomainEvent } from '@potentiel-domain/core';

export type Unsubscribe = () => Promise<void>;

export type Subscriber<TEvent extends DomainEvent = DomainEvent> = {
  name: string;
  eventType: TEvent['type'] | ReadonlyArray<TEvent['type']> | 'all';
  eventHandler: (event: TEvent) => Promise<void>;
  streamCategory: string;
};
