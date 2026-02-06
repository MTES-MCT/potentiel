import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainEvent } from '@potentiel-domain/core';

import { Subscriber } from '../subscriber/subscriber.js';

import { acknowledge } from './acknowledge.js';
import { getEventsWithPendingAcknowledgement } from './getEventsWithPendingAcknowledgement.js';

export async function retryPendingAcknowledgement<TEvent extends DomainEvent = DomainEvent>({
  streamCategory,
  name,
  eventHandler,
}: Subscriber<TEvent>) {
  const events = await getEventsWithPendingAcknowledgement<TEvent>(streamCategory, name);

  const logger = getLogger(`Subscriber.Retry.${streamCategory}.${name}`);
  for (const event of events) {
    try {
      await eventHandler(event);

      const { created_at, stream_id, version } = event;
      await acknowledge({
        stream_category: streamCategory,
        subscriber_name: name,
        stream_id,
        created_at,
        version,
      });
    } catch (e) {
      logger.error(new Error('Retry failed', { cause: e as Error }), { event });
    }
  }
}
