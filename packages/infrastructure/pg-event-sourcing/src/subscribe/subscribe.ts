import { ExponentialBackoff, type FailureReason, handleAll, retry } from 'cockatiel';
import { Client } from 'pg';

import type { DomainEvent } from '@potentiel-domain/core';
import { getLogger } from '@potentiel-libraries/monitoring';
import { getConnectionString } from '@potentiel-libraries/pg-helpers';

import { retryPendingAcknowledgement } from './acknowledgement/retryPendingAcknowledgement.js';
import { EventStreamEmitter } from './eventStreamEmitter.js';
import { listSubscribers } from './subscriber/listSubscribers.js';
import { registerSubscriber } from './subscriber/registerSubscriber.js';
import type { Subscriber, Unsubscribe } from './subscriber/subscriber.js';

let isReconnecting = false;
let client: Client | undefined;

// biome-ignore lint/suspicious/noExplicitAny: EventStreamEmitter type unkown
const eventStreamEmitters = new Map<string, EventStreamEmitter<any>>();

export const subscribe = async <TEvent extends DomainEvent = DomainEvent>(
  subscriber: Subscriber<TEvent>,
): Promise<Unsubscribe> => {
  if (!client) {
    client = await connect();
  }

  /*
   +1 pour le nouvel emitter qui va être ajouté
   +2 pour les listeners error/notification qui proviennent de connect()
  */
  client.setMaxListeners(eventStreamEmitters.size + 3);

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
  client.on('notification', handleNotificationError);
  await client.query('LISTEN "error_notifications"');

  return client;
};

const handleClientError = async (error: Error) => {
  if (!isReconnecting) {
    const logger = getLogger('EventSourcing Subscribe');

    logger.warn(`An error occurred from subscribe Postgresql client`, {
      error,
    });
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

      /* 
        Contexte de reconnexion, les émitters existants sont déjà ok
        donc size+2 suffit, on ne fait que restaurer les listeners déjà comptabilisés
      */
      client.setMaxListeners(eventStreamEmitters.size + 2);

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

const handleNotificationError = (notification: { channel: string; payload?: string }) => {
  if (notification.channel !== 'error_notifications') return;

  const logger = getLogger('EventSourcing.ErrorNotification');
  const details = JSON.parse(notification.payload ?? '{}');
  logger.error(new PostgresNotificationError(details));
};

const disconnect = async () => {
  await client?.end();
  client = undefined;
};

class SubscribeClientReconnectionError extends Error {
  constructor(public failureReason: FailureReason<unknown>) {
    super(`Subscribe Postrgesql client failed to reconnect after 10 retries`);
  }
}

class PostgresNotificationError extends Error {
  constructor(public details: Record<string, unknown>) {
    super((details.error_message as string) ?? 'Unknown PostgreSQL notification error');
    this.name = 'PostgresNotificationError';
  }
}
