import { Client } from 'pg';

import { getConnectionString } from '@potentiel-libraries/pg-helpers';

import { Event } from '../event';

import { registerSubscriber } from './subscriber/registerSubscriber';
import { EventStreamEmitter } from './eventStreamEmitter';
import { Subscriber, Unsubscribe } from './subscriber/subscriber';
import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement';

let client: Client | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subscribers = new Map<string, Subscriber<any>>();

export const subscribe = async <TEvent extends Event = Event>(
  subscriber: Subscriber<TEvent>,
): Promise<Unsubscribe> => {
  if (!client) {
    client = await connect();
  }

  subscribers.set(`${subscriber.streamCategory}-${subscriber.name}`, subscriber);
  client.setMaxListeners(subscribers.size);

  await registerSubscriber(subscriber);

  const eventStreamEmitter = new EventStreamEmitter(client, {
    eventHandler: subscriber.eventHandler,
    eventType: subscriber.eventType,
    name: subscriber.name,
    streamCategory: subscriber.streamCategory,
  } as Subscriber);

  await eventStreamEmitter.listen();

  return async () => {
    await eventStreamEmitter.unlisten();

    subscribers.delete(`${subscriber.streamCategory}-${subscriber.name}`);
    client?.setMaxListeners(subscribers.size);

    if (subscribers.size === 0) {
      await disconnect();
    }
  };
};

export const executeSubscribersRetry = async () => {
  for (const subscriber of subscribers.values()) {
    await retryPendingAcknowledgement(subscriber);
  }
};

const connect = async () => {
  const client = new Client(getConnectionString());
  await client.connect();
  return client;
};

const disconnect = async () => {
  await client?.end();
  client = undefined;
};
