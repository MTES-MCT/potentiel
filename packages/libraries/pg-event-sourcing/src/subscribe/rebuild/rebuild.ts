import { DomainEvent, Subscriber } from '@potentiel/core-domain';
import { loadFromStream } from '../../load/loadFromStream';
import { RebuildTriggered } from '@potentiel/core-domain-views';

/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export const rebuild = async <TDomainEvent extends DomainEvent = DomainEvent>(
  rebuildTriggered: RebuildTriggered,
  { eventType, eventHandler }: Subscriber<TDomainEvent>,
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
  } as unknown as TDomainEvent);

  for (const event of events) {
    await eventHandler({
      type: event.type,
      payload: event.payload,
    } as TDomainEvent);
  }
};
