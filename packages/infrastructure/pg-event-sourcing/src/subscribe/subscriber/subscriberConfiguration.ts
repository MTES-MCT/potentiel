import type { Subscriber } from './subscriber';

export type SubscriberConfiguration = Omit<Subscriber, 'eventHandler'>;
