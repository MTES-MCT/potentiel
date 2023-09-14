import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { Event } from '../event';
import { registerSubscriber } from './subscriber/registerSubscription';
import { EventStreamEmitter } from './eventStreamEmitter';
import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement';

export const subscribe = async <TDomainEvent extends DomainEvent = Event>(
  subscriber: Subscriber<TDomainEvent>,
): Promise<Unsubscribe> => {
  await retryPendingAcknowledgement<TDomainEvent>(subscriber);
  await registerSubscriber(subscriber);

  const eventStreamEmitter = new EventStreamEmitter({
    eventHandler: subscriber.eventHandler,
    eventType: subscriber.eventType,
    name: subscriber.name,
    streamCategory: subscriber.streamCategory,
  } as Subscriber);
  eventStreamEmitter.setMaxListeners(3);
  await eventStreamEmitter.connect();
  await eventStreamEmitter.listen();

  return async () => {
    return eventStreamEmitter.disconnect();
  };
};
