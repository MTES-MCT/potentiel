import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { Event } from '../../event';
import { acknowledge } from './acknowledge';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';
import { getLogger } from '@potentiel/monitoring';
import { SubscriberId } from '../subscriber/subscriberId';

export async function retryPendingAcknowledgement<TDomainEvent extends DomainEvent = Event>({
  streamCategory,
  name,
  eventHandler,
}: Subscriber<TDomainEvent>) {
  const events = await getEventsWithPendingAcknowledgement(streamCategory, name);
  const subscriberId: SubscriberId = `${streamCategory}|${name}`;

  try {
    for (const { stream_id, created_at, version, type, payload } of events) {
      await eventHandler({
        type,
        payload,
      } as TDomainEvent);

      await acknowledge({
        subscriber_id: subscriberId,
        stream_id,
        created_at,
        version,
      });
    }
  } catch (e) {
    getLogger().error(e as Error);
  }
}
