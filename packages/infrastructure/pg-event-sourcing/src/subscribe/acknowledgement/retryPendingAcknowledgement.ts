import { DomainEvent, Subscriber } from '@potentiel-domain/core';
import { Event } from '../../event';
import { acknowledge } from './acknowledge';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';
import { getLogger } from '@potentiel/monitoring';

export async function retryPendingAcknowledgement<TDomainEvent extends DomainEvent = Event>({
  streamCategory,
  name,
  eventHandler,
}: Subscriber<TDomainEvent>) {
  const events = await getEventsWithPendingAcknowledgement(streamCategory, name);

  try {
    for (const { stream_id, created_at, version, type, payload } of events) {
      await eventHandler({
        type,
        payload,
      } as TDomainEvent);

      await acknowledge({
        stream_category: streamCategory,
        subscriber_name: name,
        stream_id,
        created_at,
        version,
      });
    }
  } catch (e) {
    getLogger().error(e as Error);
  }
}
