import { EventEmitter } from 'events';
import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { executeQuery, getConnectionString } from '@potentiel/pg-helpers';
import { Event, isEvent } from './event';
import { Client } from 'pg';
import { getLogger } from '@potentiel/monitoring';
import { WrongSubscriberNameError } from './errors/wrongSubscriberName.error';

class EventStreamEmitter extends EventEmitter {
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
    this.#unlisten = listenToNewEvent(eventStreamEmitter, name);
    if (!this.#isListening) {
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
        getLogger().warn('Unknown event', {
          event,
        });
      }
    };

    this.on(name, listener);

    return async () => {
      this.removeListener(name, listener);
      if (!this.listenerCount(name)) {
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
  checkSubscriberName(subscriber.name);
  await registerSubscription(subscriber);
  if (!eventStreamEmitter) {
    eventStreamEmitter = new EventStreamEmitter();
    eventStreamEmitter.setMaxListeners(50);
  }

  return Promise.resolve(eventStreamEmitter.subscribe(subscriber));
};

export const listenToNewEvent = (eventEmitter: EventEmitter, name: string) => {
  const client = new Client(getConnectionString());
  client.connect((err) => {
    if (!err) {
      client.on('notification', (notification) => {
        eventEmitter.emit(notification.channel, notification.payload);
      });
      client.query(`listen ${name}`);
    } else {
      console.error(err);
    }
  });

  return async () => {
    await client.query(`unlisten ${name}`);
    //await client.end();
  };
};

const checkSubscriberName = (name: string) => {
  const isValid = /^[a-z]+(?:_[a-z]+)*$/.test(name);

  if (!isValid) throw new WrongSubscriberNameError();
};

const registerSubscription = async <TDomainEvent extends DomainEvent = Event>({
  eventType,
  name,
}: Subscriber<TDomainEvent>) => {
  const filter =
    eventType === 'all' ? null : JSON.stringify(Array.isArray(eventType) ? eventType : [eventType]);
  await executeQuery(`insert into event_store.subscriber values($1, $2)`, name, filter);
};

export const cleanSubscribers = async () => executeQuery(`delete from event_store.subscriber`);
