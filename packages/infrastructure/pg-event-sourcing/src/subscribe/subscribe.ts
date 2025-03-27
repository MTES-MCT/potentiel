import { Client } from 'pg';
import { retry, ExponentialBackoff, handleAll } from 'cockatiel';

import { getConnectionString } from '@potentiel-libraries/pg-helpers';

import { Event } from '../event';

import { registerSubscriber } from './subscriber/registerSubscriber';
import { EventStreamEmitter } from './eventStreamEmitter';
import { Subscriber, Unsubscribe } from './subscriber/subscriber';
import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement';

let isReconnecting = false;
let client: Client | undefined;
const subscribers = new Map<
  string,
  { subscriber: Subscriber; eventStreamEmitter: EventStreamEmitter }
>();

export const subscribe = async <TEvent extends Event = Event>(
  subscriber: Subscriber<TEvent>,
): Promise<Unsubscribe> => {
  if (!client) {
    client = await connect();
  }

  client.setMaxListeners(subscribers.size + 1);

  await registerSubscriber(subscriber);

  const eventStreamEmitter = new EventStreamEmitter(client, {
    eventHandler: subscriber.eventHandler,
    eventType: subscriber.eventType,
    name: subscriber.name,
    streamCategory: subscriber.streamCategory,
  } as Subscriber);

  await eventStreamEmitter.listen();

  subscribers.set(`${subscriber.streamCategory}-${subscriber.name}`, {
    subscriber: subscriber as unknown as Subscriber<Event>,
    eventStreamEmitter,
  });

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
  for (const { subscriber } of subscribers.values()) {
    await retryPendingAcknowledgement(subscriber);
  }
};

const connect = async () => {
  const client = new Client(getConnectionString());

  await client.connect();

  client.on('error', async () => {
    if (!isReconnecting) {
      isReconnecting = true;
      await Reconnect();
      isReconnecting = false;
    }
  });

  return client;
};

const disconnect = async () => {
  await client?.end();
  client = undefined;
};

async function Reconnect() {
  await retry(handleAll, {
    maxAttempts: 5,
    backoff: new ExponentialBackoff(),
  }).execute(async () => {
    client = await connect();
  });

  if (client) {
    for (const [, { subscriber, eventStreamEmitter }] of subscribers) {
      await eventStreamEmitter.updateClient(client);
      await retryPendingAcknowledgement(subscriber);
    }
  }
}
