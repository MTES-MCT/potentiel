import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { loadFromStream } from '../../load/loadFromStream';
import { getLogger } from '@potentiel/monitoring';
import { acknowledge } from '../acknowledgement/acknowledge';
import { RebuildTriggered } from '@potentiel/core-domain-views';

export const rebuild = async <TDomainEvent extends DomainEvent = DomainEvent>(
  rebuildTriggered: RebuildTriggered,
  { eventType, name, streamCategory, eventHandler }: Subscriber<TDomainEvent>,
) => {
  const streamId = `${rebuildTriggered.payload.category}|${rebuildTriggered.payload.id}`;
  try {
    const events = await loadFromStream({
      streamId,
      eventTypes:
        eventType === 'all' ? undefined : Array.isArray(eventType) ? eventType : [eventType],
    });

    getLogger().info('Rebuilding', {
      streamId,
      subscriber: {
        name,
        streamCategory,
        eventType,
      },
    });

    await eventHandler({
      type: rebuildTriggered.type,
      payload: rebuildTriggered.payload,
    } as unknown as TDomainEvent);

    for (const event of events) {
      await eventHandler({
        type: event.type,
        payload: event.payload,
      } as TDomainEvent);

      await acknowledge({
        subscriber_id: `${streamCategory}|${name}`,
        created_at: event.created_at,
        stream_id: event.stream_id,
        version: event.version,
      });
    }
  } catch (error) {
    getLogger().error(new Error('Rebuild failed'), {
      error,
      streamId,
      subscriber: {
        name,
        streamCategory,
        eventType,
      },
    });
  }
};
