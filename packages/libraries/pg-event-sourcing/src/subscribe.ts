import { EventEmitter } from 'events';
import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel/core-domain';
import { executeQuery, executeSelect, getConnectionString } from '@potentiel/pg-helpers';
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
          await acknowledge(name, event);
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

  const pendingEvent = await getPendingEvent(subscriber.name);

  for (const event of pendingEvent) {
    await subscriber.eventHandler(event as unknown as TDomainEvent);
    await acknowledge(subscriber.name, event);
  }

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

const acknowledge = async (subscriberName: string, { stream_id, created_at, version }: Event) => {
  await executeQuery(
    `
    delete from event_store.pending_acknowledgement 
    where subscriber_id = $1 and stream_id = $2 and created_at = $3 and version = $4
  `,
    subscriberName,
    stream_id,
    created_at,
    version,
  );
};

const getPendingEvent = async (subscribeName: string) => {
  return executeSelect<Event>(
    `
      select es.* 
      from event_store.event_stream es
      inner join event_store.pending_acknowledgement pa on pa.stream_id = es.stream_id and pa.created_at = es.created_at and pa.version = es.version
      where pa.subscriber_id = $1`,
    subscribeName,
  );
};

export const cleanSubscribers = async () => executeQuery(`delete from event_store.subscriber`);
