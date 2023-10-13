import { Subscriber } from '@potentiel/core-domain';

export type SubscriberConfiguration = Omit<Subscriber, 'eventHandler'>;
