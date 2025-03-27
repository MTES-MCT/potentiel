import { Client } from 'pg';
import { retry, ExponentialBackoff, handleAll, FailureReason } from 'cockatiel';

import { getConnectionString } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';

import { Event } from '../event';

import { registerSubscriber } from './subscriber/registerSubscriber';
import { EventStreamEmitter } from './eventStreamEmitter';
import { Subscriber, Unsubscribe } from './subscriber/subscriber';
import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement';

let isReconnecting = false;
let client: Client | undefined;

const eventStreamEmitters = new Map<string, EventStreamEmitter>();

export const subscribe = async <TEvent extends Event = Event>(
  subscriber: Subscriber<TEvent>,
): Promise<Unsubscribe> => {
  if (!client) {
    client = await connect();
  }

  client.setMaxListeners(eventStreamEmitters.size + 1);

  await registerSubscriber(subscriber);

  const eventStreamEmitter = new EventStreamEmitter(client, {
    eventHandler: subscriber.eventHandler,
    eventType: subscriber.eventType,
    name: subscriber.name,
    streamCategory: subscriber.streamCategory,
  } as Subscriber);

  await eventStreamEmitter.listen();

  const eventStreamEmitterId = `${subscriber.streamCategory}-${subscriber.name}`;
  eventStreamEmitters.set(eventStreamEmitterId, eventStreamEmitter);

  return async () => {
    await eventStreamEmitter.unlisten();

    eventStreamEmitters.delete(eventStreamEmitterId);
    client?.setMaxListeners(eventStreamEmitters.size);

    if (eventStreamEmitters.size === 0) {
      await disconnect();
    }
  };
};

export const executeSubscribersRetry = async () => {
  for (const eventStreamEmitter of eventStreamEmitters.values()) {
    await retryPendingAcknowledgement(eventStreamEmitter.subscriber);
  }
};

const connect = async () => {
  const client = new Client(getConnectionString());

  await client.connect();
  client.on('error', handleClientError);

  return client;
};

const disconnect = async () => {
  await client?.end();
  client = undefined;
};

const handleClientError = async (error: Error) => {
  const logger = getLogger('EventSourcing Subscribe');

  logger.warn(`An error occurred from subscribe Postgresql client`, { error });

  if (!isReconnecting) {
    logger.info(`Trying to reconnect subscribe Postgresql client...`);

    isReconnecting = true;

    const retryPolicy = retry(handleAll, {
      maxAttempts: 10,
      backoff: new ExponentialBackoff(),
    });

    retryPolicy.onGiveUp((failureReason) => {
      logger.error(new SubscribeClientReconnectionError(failureReason));
    });

    await retryPolicy.execute(async () => {
      client = await connect();
      logger.info(`Subscribe Postgresql client reconnection succeeds !`);
    });

    if (client) {
      for (const eventStreamEmitter of eventStreamEmitters.values()) {
        await eventStreamEmitter.updateClient(client);
      }

      await executeSubscribersRetry();
    }

    isReconnecting = false;
  }
};

class SubscribeClientReconnectionError extends Error {
  /**
   *
   */
  constructor(public failureReason: FailureReason<unknown>) {
    super(`Subscribe Postrgesql client failed to reconnect after 10 retries`);
  }
}
