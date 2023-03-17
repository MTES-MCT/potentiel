import { EventEmitter } from 'events';
import { DomainEvent, DomainEventHandler, Unsubscribe } from '@potentiel/core-domain';
import { listenTo } from '@potentiel/pg-helpers';
import { isEvent } from './event';

class EventStreamEmitter extends EventEmitter {
  readonly #channel = 'new_event';
  #isListening: boolean;
  #unlisten: () => Promise<void>;

  constructor() {
    super();
    this.#isListening = false;
    this.#unlisten = () => Promise.reject(new Error('EventStream emmitter is not listenning.'));
  }

  subscribe<TDomainEvent extends DomainEvent>(
    eventType: TDomainEvent['type'] | 'all',
    eventHandler: DomainEventHandler<TDomainEvent>,
  ) {
    if (!this.#isListening) {
      this.#unlisten = listenTo(this.#channel, eventStreamEmitter);
      this.#isListening = true;
    }

    const listener = async (payload: string) => {
      const event = JSON.parse(payload);
      if (isEvent(event)) {
        if (eventType === 'all' || event.type === eventType) {
          const { version, createdAt, streamId, ...domainEvent } = event;
          await eventHandler(domainEvent as TDomainEvent);
        }
      } else {
        // TODO use logger here if event is unknwon (warn)
      }
    };

    this.on(this.#channel, listener);

    return async () => {
      this.removeListener(this.#channel, listener);
      if (!this.listenerCount(this.#channel)) {
        await this.#unlisten();
        this.#isListening = false;
      }
    };
  }
}

let eventStreamEmitter: EventStreamEmitter;

export const subscribe = async <TDomainEvent extends DomainEvent>(
  eventType: TDomainEvent['type'] | 'all',
  eventHandler: DomainEventHandler<TDomainEvent>,
): Promise<Unsubscribe> => {
  if (!eventStreamEmitter) {
    eventStreamEmitter = new EventStreamEmitter();
  }

  return eventStreamEmitter.subscribe(eventType, eventHandler);
};
