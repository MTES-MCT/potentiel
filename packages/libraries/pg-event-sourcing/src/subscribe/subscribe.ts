import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { Event } from '../event';
import { getLogger } from '@potentiel/monitoring';
import { registerSubscriber } from './registerSubscription';
import { EventStreamEmitter } from './eventStreamEmitter';
import { checkSubscriberName } from './checkSubscriberName';
import { retryPendingAcknowledgement } from './retryPendingAcknowledgement';

export let eventStreamEmitter: EventStreamEmitter;

export const subscribe = async <TDomainEvent extends DomainEvent = Event>(
  subscriber: Subscriber<TDomainEvent>,
): Promise<Unsubscribe> => {
  checkSubscriberName(subscriber.name);

  try {
    await retryPendingAcknowledgement<TDomainEvent>(subscriber);
  } catch (error) {
    getLogger().error(new Error('Failed to replay pending event'), { error });
  }

  await registerSubscriber(subscriber);

  if (!eventStreamEmitter) {
    eventStreamEmitter = new EventStreamEmitter();
    eventStreamEmitter.setMaxListeners(50);
  }

  return Promise.resolve(eventStreamEmitter.subscribe(subscriber));
};
