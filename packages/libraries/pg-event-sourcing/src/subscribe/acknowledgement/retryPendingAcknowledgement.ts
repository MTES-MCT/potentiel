import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { Event } from '../../event';
import { acknowledge } from './acknowledge';
import { executeSelect } from '@potentiel/pg-helpers';

const selectEventsWithPendingAcknowledgement = `
   select 
      es.stream_id,
      es.created_at,
      es.version,
      es.type,
      es.payload
   from event_store.event_stream es 
   inner join event_store.pending_acknowledgement pa on 
      pa.stream_id = es.stream_id and 
      pa.created_at = es.created_at and 
      pa.version = es.version 
   where pa.subscriber_id = $1`;

export async function retryPendingAcknowledgement<TDomainEvent extends DomainEvent = Event>(
  subscriber: Subscriber<TDomainEvent>,
) {
  const subscriberId = `${subscriber.streamCategory}|${subscriber.name}`;
  const pendingEvent = await executeSelect<Event>(
    selectEventsWithPendingAcknowledgement,
    subscriberId,
  );

  for (const event of pendingEvent) {
    await subscriber.eventHandler(event as unknown as TDomainEvent);
    await acknowledge(`${subscriber.streamCategory}|${subscriber.name}`, event);
  }
}
