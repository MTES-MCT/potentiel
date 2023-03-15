import { EventEmitter } from 'events';
import { DomainEvent, DomainEventHandler } from '@potentiel/core-domain';
import { listenTo } from '@potentiel/pg-helpers';
import { isEvent } from './event';

class EventStreamEmitter extends EventEmitter {}

let eventStreamEmitter: EventStreamEmitter;
const channel = 'new_event';

export const subscribe = async <TDomainEvent extends DomainEvent>(
  eventType: TDomainEvent['type'] | 'all',
  eventHandler: DomainEventHandler<TDomainEvent>,
) => {
  if (!eventStreamEmitter) {
    eventStreamEmitter = new EventStreamEmitter();
    listenTo(channel, eventStreamEmitter);
  }

  eventStreamEmitter.on(channel, async (payload: string) => {
    const event = JSON.parse(payload);
    if (isEvent(event)) {
      if (eventType === 'all' || event.type === eventType) {
        const { version, createdAt, streamId, ...domainEvent } = event;
        await eventHandler(domainEvent as TDomainEvent);
      }
    } else {
      // TODO something
    }
  });
};
