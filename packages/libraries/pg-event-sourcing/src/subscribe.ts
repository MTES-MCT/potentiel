import { EventEmitter } from 'events';
import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { executeQuery, getConnectionString } from '@potentiel/pg-helpers';
import { Event, isEvent } from './event';
import { Client } from 'pg';

const registerSubscription = async <TDomainEvent extends DomainEvent = Event>({
  eventType,
  name,
}: Subscriber<TDomainEvent>) => {
  const filter =
    eventType === 'all' ? null : JSON.stringify(Array.isArray(eventType) ? eventType : [eventType]);
  await executeQuery(`insert into event_store.subscriber values($1, $2)`, name, filter);
};

class EventStreamEmitter extends EventEmitter {
  readonly #channel = 'new_event';
  #isListening: boolean;
  #unlisten: () => Promise<void>;

  constructor() {
    super();
    this.#isListening = false;
    this.#unlisten = () => Promise.reject(new Error('EventStream emmitter is not listenning.'));
  }

  subscribe<TDomainEvent extends DomainEvent>({
    eventHandler,
    eventType,
    name,
  }: Subscriber<TDomainEvent>): Unsubscribe {
    if (!this.#isListening) {
      this.#unlisten = listenToNewEvent(eventStreamEmitter);
      this.#isListening = true;
    }

    const listener = async (payload: string) => {
      const event = JSON.parse(payload) as TDomainEvent;

      if (isEvent(event)) {
        if (
          eventType === 'all' ||
          (Array.isArray(eventType) ? eventType.includes(event.type) : event.type === eventType)
        ) {
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
  subscriber: Subscriber<TDomainEvent>,
): Promise<Unsubscribe> => {
  await registerSubscription(subscriber);
  if (!eventStreamEmitter) {
    eventStreamEmitter = new EventStreamEmitter();
    eventStreamEmitter.setMaxListeners(50);
  }

  return Promise.resolve(eventStreamEmitter.subscribe(subscriber));
};

export const listenToNewEvent = (eventEmitter: EventEmitter) => {
  const client = new Client(getConnectionString());
  client.connect((err) => {
    if (!err) {
      client.on('notification', (notification) => {
        eventEmitter.emit(notification.channel, notification.payload);
      });
      client.query(`listen new_event`);
    }
  });

  return async () => {
    await client.query(`unlisten new_event`);
    await client.end();
  };
};
