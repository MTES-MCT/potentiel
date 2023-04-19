import { Redis } from 'ioredis';
import { getRedis } from './getRedis';

export type Event<TType extends string = string, TPayload extends Record<string, unknown> = {}> = {
  type: TType;
  payload: TPayload;
};

type EventHandler<TEvent extends Event = Event> = (event: TEvent) => Promise<void>;

export type Consumer = {
  name: string;
  consume: <TEvent extends Event>(type: TEvent['type'], handler: EventHandler<TEvent>) => void;
};

export const consumerFactory = async (name: string): Promise<Consumer> => {
  const streamName = process.env.REDIS_EVENT_BUS_STREAM_NAME || '';

  const redis = await getRedis();
  const groupName = await createConsumerGroup(redis, streamName, name);

  const handlers: Map<Event['type'], EventHandler> = new Map();
  const consumerRedisClient = redis.duplicate();

  const listenForMessage = async () => {
    const message = await getNextMessageToHandle(consumerRedisClient, streamName, groupName, name);

    if (message) {
      const [, messageValue] = message;
      const [eventType, eventPayload] = messageValue;
      const handler = handlers.get(eventType);
      if (handler) {
        try {
          await handler(JSON.parse(eventPayload));
        } catch (error) {
          // TODO log

          await consumerRedisClient.xadd(`${name}-DLQ`, '*', messageValue);
        }
      }

      const [messageId] = message;
      await consumerRedisClient.xack(streamName, groupName, messageId);

      listenForMessage();
    }
  };

  listenForMessage();

  const consume = <TEvent extends Event>(type: TEvent['type'], handler: EventHandler<TEvent>) => {
    handlers.set(type, handler as EventHandler);
  };

  return { name, consume };
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
