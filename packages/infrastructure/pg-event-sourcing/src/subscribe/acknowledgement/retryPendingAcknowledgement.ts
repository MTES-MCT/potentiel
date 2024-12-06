import { getLogger } from '@potentiel-libraries/monitoring';

import { Event } from '../../event';
import { Subscriber } from '../subscriber/subscriber';

import { acknowledge } from './acknowledge';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement';

export async function retryPendingAcknowledgement<TEvent extends Event = Event>({
  streamCategory,
  name,
  eventHandler,
}: Subscriber<TEvent>) {
  const events = await getEventsWithPendingAcknowledgement(streamCategory, name);

  try {
    for (const event of events) {
      await eventHandler(event as TEvent);

      const { created_at, stream_id, version } = event;
      await acknowledge({
        stream_category: streamCategory,
        subscriber_name: name,
        stream_id,
        created_at,
        version,
      });
    }
  } catch (e) {
    getLogger('Infrastructure.pg-event-sourcing.retryPendingAcknowledgement').error(e as Error);
  }
}
