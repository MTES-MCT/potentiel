import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { Event } from '../../event';
import { acknowledge } from './acknowledge';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';
import { getLogger } from '@potentiel/monitoring';
import { SubscriberId } from '../subscriber/subscriberId';
import { Acknowledgement } from './acknowledgement';

export async function retryPendingAcknowledgement<TDomainEvent extends DomainEvent = Event>({
  streamCategory,
  name,
  eventHandler,
}: Subscriber<TDomainEvent>) {
  const events = await getEventsWithPendingAcknowledgement(streamCategory, name);
  const subscriberId: SubscriberId = `${streamCategory}|${name}`;

  try {
    for (const { stream_id, created_at, version, type, payload } of events) {
      const acknowledgement: Acknowledgement = {
        subscriber_id: subscriberId,
        stream_id,
        created_at,
        version,
      };
      await eventHandler({
        type,
        payload,
      } as TDomainEvent);
      await acknowledge(acknowledgement);
    }
  } catch (e) {
    getLogger().error(e as Error);
  }
}
