import { Subscriber } from '@potentiel/core-domain';

/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export type SubscriberConfiguration = Omit<Subscriber, 'eventHandler'>;
