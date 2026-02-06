import { DomainEvent } from '@potentiel-domain/core';

import { loadFromStream } from '../../load/loadFromStream.js';
import { Subscriber } from '../subscriber/subscriber.js';
import { RebuildFailedError } from '../errors/RebuildFailed.error.js';

import { RebuildTriggered } from './rebuildTriggered.event.js';

export const rebuild = async <TEvent extends DomainEvent = DomainEvent>(
  rebuildTriggered: RebuildTriggered,
  { eventType, eventHandler }: Subscriber<TEvent>,
) => {
  const streamId = `${rebuildTriggered.payload.category}|${rebuildTriggered.payload.id}`;

  const events = await loadFromStream<TEvent>({
    streamId,
    eventTypes:
      eventType === 'all' ? undefined : Array.isArray(eventType) ? eventType : [eventType],
  });

  await eventHandler(rebuildTriggered as unknown as TEvent);

  for (const event of events) {
    try {
      await eventHandler(event as TEvent);
    } catch (error) {
      throw new RebuildFailedError(error, event);
    }
  }
};
