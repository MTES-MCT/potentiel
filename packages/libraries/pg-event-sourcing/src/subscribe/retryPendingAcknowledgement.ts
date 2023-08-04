import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { Event } from '../event';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';
import { acknowledge } from './acknowledge';

export async function retryPendingAcknowledgement<TDomainEvent extends DomainEvent = Event>(
  subscriber: Subscriber<TDomainEvent>,
) {
  const pendingEvent = await getEventsWithPendingAcknowledgement(subscriber.name);

  for (const event of pendingEvent) {
    await subscriber.eventHandler(event as unknown as TDomainEvent);
    await acknowledge(subscriber.name, event);
  }
}
