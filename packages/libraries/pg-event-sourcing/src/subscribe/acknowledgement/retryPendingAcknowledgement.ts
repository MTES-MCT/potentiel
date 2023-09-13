import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { Event } from '../../event';
import { acknowledge } from './acknowledge';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';

export async function retryPendingAcknowledgement<TDomainEvent extends DomainEvent = Event>({
  streamCategory,
  name,
  eventHandler,
}: Subscriber<TDomainEvent>) {
  const events = await getEventsWithPendingAcknowledgement(streamCategory, name);

  for (const { stream_id, created_at, version, type, payload } of events) {
    await eventHandler({
      type,
      payload,
    } as TDomainEvent);

    await acknowledge({
      subscriber_id: `${streamCategory}|${name}`,
      stream_id,
      created_at,
      version,
    });
  }
}
