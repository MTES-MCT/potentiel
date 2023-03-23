import { EventEmitter } from 'events';
import { DomainEvent, DomainEventHandler, Unsubscribe } from '@potentiel/core-domain';
import { getConnectionString } from '@potentiel/pg-helpers';
import { Event, isEvent } from './event';
import { Client } from 'pg';

class EventStreamEmitter extends EventEmitter {
  readonly #channel = 'new_event';
  #isListening: boolean;
  #unlisten: () => Promise<void>;

  constructor() {
    super();
    this.#isListening = false;
    this.#unlisten = () => Promise.reject(new Error('EventStream emmitter is not listenning.'));
  }

  async subscribe<TDomainEvent extends DomainEvent>(
    eventType: TDomainEvent['type'] | 'all',
    eventHandler: DomainEventHandler<TDomainEvent>,
  ) {
    if (!this.#isListening) {
      this.#unlisten = listenToNewEvent(eventStreamEmitter);
      this.#isListening = true;
    }

    const listener = async (payload: string) => {
      const event = JSON.parse(payload) as TDomainEvent;
      if (isEvent(event)) {
        if (eventType === 'all' || event.type === eventType) {
          await eventHandler(event);
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

export const subscribe = async <TDomainEvent extends DomainEvent = Event>(
  eventType: TDomainEvent['type'] | 'all',
  eventHandler: DomainEventHandler<TDomainEvent>,
): Promise<Unsubscribe> => {
  if (!eventStreamEmitter) {
    eventStreamEmitter = new EventStreamEmitter();
  }

  return eventStreamEmitter.subscribe(eventType, eventHandler);
};

export const listenToNewEvent = (eventEmitter: EventEmitter) => {
  const client = new Client(getConnectionString());
  client.connect((err) => {
    if (!err) {
      client.on('notification', (notification) => {
        eventEmitter.emit(notification.channel, notification.payload);
      });
      client.query(`LISTEN new_event`);
    }
  });

  return async () => {
    await client.query(`UNLISTEN new_event`);
    await client.end();
  };
};
