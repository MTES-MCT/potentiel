import { Redis } from 'ioredis';
import { getRedis } from './getRedis';

// create GestionnaireRéseauProjector subscriber
// const subscriber = createSubscriber('GestionnaireRéseauProjector');
// await subscriber.subscribe('GestionRéseauAjouté', gestionnaireRéseauAjoutéEventHandlerFactory({ createProjection }));
// await subscriber.subscribe('GestionRéseauModifié', gestionnaireRéseauModifiéEventHandlerFactory({ createProjection }));
// await subscriber.subscribe('RebuildGestionnaireRéseau', async (event: RebuildAllGestionnaireRéseau) => {
//    const events = loadFromCategory(event.streamCategory);
//    await subscriber.unsubscribe();
//    await deleteProjectionCategory(event.projectionCategory);
//    for(const event of events) {
//      switch(event.type) { ... }
//    }
// await subscriber.subscribe('GestionRéseauAjouté', gestionnaireRéseauAjoutéEventHandlerFactory({ createProjection }));
// await subscriber.subscribe('GestionRéseauModifié', gestionnaireRéseauModifiéEventHandlerFactory({ createProjection }));
// })
// await subscriber.subscribe('RebuildGestionnaireRéseau', async (event: RebuildAllGestionnaireRéseau) => {
//    const events = loadFromStream(event.streamId);
//    await deleteProjection(event.projectionId)
//    for(const event of events) {
//      switch(event.type) { ... }
//    }
// })

type Event<TType extends string = string> = Record<string, unknown> & {
  type: TType;
};

type EventHandler<TEvent extends Event> = (event: TEvent) => Promise<void>;

type Subscriber<TEvent extends Event = { type: 'unknown' }> = {
  subscribe: (type: TEvent['type'], handler: EventHandler<TEvent>) => Promise<void>;
  unsubscribe: () => void;
};

export const createSubscriber = async <TEvent extends Event>(
  name: string,
): Promise<Subscriber<TEvent>> => {
  const streamName = process.env.REDIS_EVENT_BUS_STREAM_NAME || '';

  const redis = (await getRedis()).duplicate();
  const groupName = await createConsumerGroup(redis, streamName, name);

  const subscriber: Subscriber<TEvent> = {
    subscribe: async (type, handler) => {
      const listenForMessage = async () => {
        const message = await getNextMessageToHandle(redis, streamName, groupName, name);

        if (message) {
          const [, messageValue] = message;
          const [eventType, eventPayload] = messageValue;
          if (eventType === type) {
            try {
              await handler(JSON.parse(eventPayload));
            } catch (error) {
              // TODO log

              await redis.xadd(`${name}-DLQ`, '*', messageValue);
            }
          }
          const [messageId] = message;
          await redis.xack(streamName, groupName, messageId);

          listenForMessage();
        }
      };
      listenForMessage();
    },
    unsubscribe: () => redis.disconnect(),
  };

  return subscriber;
};

const createConsumerGroup = async (redis: Redis, streamName: string, consumerName: string) => {
  const groupName = `${consumerName}-group`;

  try {
    await redis.xgroup('CREATE', streamName, groupName, '0', 'MKSTREAM');
  } catch {}

  return groupName;
};

const getNextMessageToHandle = async (
  redis: Redis,
  streamName: string,
  groupName: string,
  consumerName: string,
) => {
  const pendingMessage = await getNextPendingMessage(redis, streamName, groupName, consumerName);
  const messageToHandle =
    pendingMessage ?? (await getNewMessage(redis, streamName, groupName, consumerName));
  return messageToHandle;
};

const getNextPendingMessage = async (
  redis: Redis,
  streamName: string,
  consumerGroupName: string,
  consumerName: string,
) => {
  const pendingStreamMessages = await redis.xreadgroup(
    'GROUP',
    consumerGroupName,
    consumerName,
    'COUNT',
    '1',
    'STREAMS',
    streamName,
    '0',
  );
  const [, pendingMessages] = pendingStreamMessages[0];
  return pendingMessages.length ? pendingMessages[0] : null;
};

const getNewMessage = async (
  redis: Redis,
  streamName: string,
  consumerGroupName: string,
  consumerName: string,
) => {
  try {
    const newRedis = redis.duplicate();
    const newStreamMessages = await newRedis.xreadgroup(
      'GROUP',
      consumerGroupName,
      consumerName,
      'BLOCK',
      0,
      'COUNT',
      '1',
      'STREAMS',
      streamName,
      '>',
    );

    newRedis.disconnect();

    const [, newMessages] = newStreamMessages[0];
    return newMessages.length ? newMessages[0] : null;
  } catch (error) {
    return null;
  }
};

export { createSubscriber as makeRedisSubscribe };
