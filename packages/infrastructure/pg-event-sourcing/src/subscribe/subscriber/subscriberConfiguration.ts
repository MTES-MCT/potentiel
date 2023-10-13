import { Subscriber } from '@potentiel-domain/core';

export type SubscriberConfiguration = Omit<Subscriber, 'eventHandler'>;
