import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { Event } from '../event';
import { getLogger } from '@potentiel/monitoring';
import { registerSubscriber } from './subscriber/registerSubscription';
import { EventStreamEmitter } from './eventStreamEmitter';
import { checkSubscriberName } from './subscriber/checkSubscriberName';
import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement';

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

  const eventStreamEmitter = new EventStreamEmitter(subscriber.streamCategory, subscriber.name);
  eventStreamEmitter.setMaxListeners(50);
  await eventStreamEmitter.connect();
  await eventStreamEmitter.listen(subscriber);

  return async () => {
    return eventStreamEmitter.disconnect();
  };
};
