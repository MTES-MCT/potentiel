import type { Subscriber } from './subscriber.js';

export type SubscriberConfiguration = Omit<Subscriber, 'eventHandler'>;
