import { Client } from 'pg';
import { retry, ExponentialBackoff, handleAll, FailureReason } from 'cockatiel';

import { getConnectionString } from '@potentiel-libraries/pg-helpers';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DomainEvent } from '@potentiel-domain/core';

import { registerSubscriber } from './subscriber/registerSubscriber';
import { EventStreamEmitter } from './eventStreamEmitter';
import { Subscriber, Unsubscribe } from './subscriber/subscriber';
import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement';
import { listSubscribers } from './subscriber/listSubscribers';

let isReconnecting = false;
let client: Client | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eventStreamEmitters = new Map<string, EventStreamEmitter<any>>();

export const subscribe = async <TEvent extends DomainEvent = DomainEvent>(
  subscriber: Subscriber<TEvent>,
): Promise<Unsubscribe> => {
  if (!client) {
    client = await connect();
  }

  client.setMaxListeners(eventStreamEmitters.size + 1);

  await registerSubscriber(subscriber);

  const eventStreamEmitter = new EventStreamEmitter<TEvent>(client, {
    eventHandler: subscriber.eventHandler,
    eventType: subscriber.eventType,
    name: subscriber.name,
    streamCategory: subscriber.streamCategory,
  });

  await eventStreamEmitter.listen();

  const eventStreamEmitterId = `${subscriber.streamCategory}-${subscriber.name}`;
  eventStreamEmitters.set(eventStreamEmitterId, eventStreamEmitter);

  return async () => {
    await eventStreamEmitter.unlisten();

    eventStreamEmitters.delete(eventStreamEmitterId);
    client?.setMaxListeners(eventStreamEmitters.size + 1);

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

/**
 * Returns the list of subscribers that are still registered, but unknown by the application
 */
export const listDanglingSubscribers = async () => {
  const expectedSubscribers = [...eventStreamEmitters.values()].map(({ subscriber }) => ({
    stream_category: subscriber.streamCategory,
    subscriber_name: subscriber.name,
  }));

  const actualSubscribers = await listSubscribers();

  const diff = actualSubscribers.filter(
    (actual) =>
      !expectedSubscribers.find(
        (expected) =>
          expected.stream_category === actual.stream_category &&
          expected.subscriber_name === actual.subscriber_name,
      ),
  );

  return diff;
};

const connect = async () => {
  const client = new Client({
    connectionString: getConnectionString(),
    application_name: 'potentiel_subscribers',
  });
  await client.connect();
  client.on('error', handleClientError);

  return client;
};

const disconnect = async () => {
  await client?.end();
  client = undefined;
};

const handleClientError = async (error: Error) => {
  if (!isReconnecting) {
    const logger = getLogger('EventSourcing Subscribe');

    logger.warn(`An error occurred from subscribe Postgresql client`, { error });
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
      client.setMaxListeners(eventStreamEmitters.size + 1);

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
