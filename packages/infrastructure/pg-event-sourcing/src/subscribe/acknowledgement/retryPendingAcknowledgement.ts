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

  const logger = getLogger(`Subscriber.Retry.${streamCategory}.${name}`);
  for (const event of events) {
    try {
      await eventHandler(event as TEvent);

      const { created_at, stream_id, version } = event;
      await acknowledge({
        stream_category: streamCategory,
        subscriber_name: name,
        stream_id,
        created_at,
        version,
      });
    } catch (e) {
      logger.error(new Error('Retry failed', { cause: e as Error }));
    }
  }
}
