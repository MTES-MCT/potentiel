import { DomainEvent, Subscriber, Unsubscribe } from '@potentiel-domain/core';
import { Event } from '../event';
import { registerSubscriber } from './subscriber/registerSubscriber';
import { EventStreamEmitter } from './eventStreamEmitter';
import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement';
import { Client } from 'pg';
import { getConnectionString } from '@potentiel/pg-helpers';

let client: Client | undefined;
const subscribers = new Set<string>();

export const subscribe = async <TDomainEvent extends DomainEvent = Event>(
  subscriber: Subscriber<TDomainEvent>,
): Promise<Unsubscribe> => {
  if (!client) {
    await connect();
  }

  subscribers.add(`${subscriber.streamCategory}-${subscriber.name}`);

  await retryPendingAcknowledgement<TDomainEvent>(subscriber);
  await registerSubscriber(subscriber);

  const eventStreamEmitter = new EventStreamEmitter(client!, {
    eventHandler: subscriber.eventHandler,
    eventType: subscriber.eventType,
    name: subscriber.name,
    streamCategory: subscriber.streamCategory,
  } as Subscriber);

  await eventStreamEmitter.listen();

  return async () => {
    await eventStreamEmitter.unlisten();

    subscribers.delete(`${subscriber.streamCategory}-${subscriber.name}`);

    if (subscribers.size === 0) {
      await disconnect();
    }
  };
};

const connect = async () => {
  return new Promise<void>((resolve, reject) => {
    client = new Client(getConnectionString());
    client.connect((err) => {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
};

const disconnect = async () => {
  await client?.end();
  client = undefined;
};
