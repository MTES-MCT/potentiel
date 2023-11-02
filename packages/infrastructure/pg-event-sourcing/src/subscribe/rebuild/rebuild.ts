import { Event } from '../../event';
import { loadFromStream } from '../../load/loadFromStream';
import { Subscriber } from '../subscriber/subscriber';
import { RebuildTriggered } from './rebuildTriggered.event';

export const rebuild = async <TEvent extends Event = Event>(
  rebuildTriggered: RebuildTriggered,
  { eventType, eventHandler }: Subscriber<TEvent>,
) => {
  const streamId = `${rebuildTriggered.payload.category}|${rebuildTriggered.payload.id}`;

  const events = await loadFromStream({
    streamId,
    eventTypes:
      eventType === 'all' ? undefined : Array.isArray(eventType) ? eventType : [eventType],
  });

  await eventHandler({
    type: rebuildTriggered.type,
    payload: rebuildTriggered.payload,
  } as unknown as TEvent);

  for (const event of events) {
    await eventHandler({
      type: event.type,
      payload: event.payload,
    } as TEvent);
  }
};
