import { Event } from '../../event';

export type Unsubscribe = () => Promise<void>;

export type Subscriber<TEvent extends Event = Event> = {
  name: string;
  eventType: TEvent['type'] | ReadonlyArray<TEvent['type']> | 'all';
  eventHandler: (event: TEvent) => Promise<void>;
  streamCategory: string;
};
