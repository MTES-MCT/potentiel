import { afterAll, afterEach, describe, expect, it, jest } from '@jest/globals';
import Redis from 'ioredis';
import { makeRedisSubscribe } from './redisSubscribe';
import { UserProjectsLinkedByContactEmail } from '../../modules/authZ';
import { fromRedisMessage } from './helpers/fromRedisMessage';
import waitForExpect from 'wait-for-expect';
import { DomainEvent } from '../../core/domain';

describe('redisSubscribe', () => {
  const streamName = 'potentiel-event-bus-subscribe-tests';
  const redis = new Redis({ port: 6380, lazyConnect: true, showFriendlyErrorStack: true });
  const duplicatedRedisClients: Redis.Redis[] = [];

  const redisDependency = redis.duplicate();
  redisDependency.duplicate = () => {
    const newRedis = redis.duplicate();
    duplicatedRedisClients.push(newRedis);
    return newRedis;
  };

  afterEach(async () => {
    await redis.del(streamName);
  });

  afterAll(async () => {
    duplicatedRedisClients.map((r) => r.status !== 'end' && r.disconnect());
    await redisDependency.quit();
    await redis.quit();
  });

  describe('when subscribing before some messages were added to the stream', () => {
    it('should be called with the events that were published after subscription', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      });

      const consumer = jest.fn<() => Promise<void>>().mockImplementation(() => Promise.resolve());

      redisSubscribe(consumer, 'MyConsumer');

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      };
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));

      await waitForExpect(() => {
        expect(consumer).toHaveBeenCalledTimes(2);
        expect(consumer).toHaveBeenCalledWith({
          ...fromRedisMessage(event),
          id: expect.anything(),
        });
      });
    });
  });

  describe('when subscribing after some messages were added to the stream', () => {
    it('should be called with the events the were in the stream before the subscription', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      });

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      };
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));

      const consumer = jest.fn<() => Promise<void>>().mockImplementation(() => Promise.resolve());
      redisSubscribe(consumer, 'MyConsumer');

      await waitForExpect(() => {
        expect(consumer).toHaveBeenCalledTimes(2);
        expect(consumer).toHaveBeenCalledWith({
          ...fromRedisMessage(event),
          id: expect.anything(),
        });
      });
    });
  });

  describe('when the consumer failed to handle the event', () => {
    const failedEvent = {
      type: UserProjectsLinkedByContactEmail.type,
      payload: { userId: 'failed', projectIds: ['1', '2', '3'] },
      occurredAt: 1234,
    };
    const successfulEvent = {
      type: UserProjectsLinkedByContactEmail.type,
      payload: { userId: '3', projectIds: ['4', '5', '6'] },
      occurredAt: 5678,
    };

    const consumer = jest
      .fn<(event: DomainEvent) => Promise<void>>()
      .mockImplementation((event) => {
        if (event.payload.userId === 'failed') {
          return Promise.reject('An error occured');
        }

        return Promise.resolve();
      });

    it('should send the failed message to the consumer only once', async () => {
      await redis.del('MyConsumer-DLQ');

      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      });
      redisSubscribe(consumer, 'MyConsumer');

      await redis.xadd(streamName, '*', failedEvent.type, JSON.stringify(failedEvent));
      await redis.xadd(streamName, '*', successfulEvent.type, JSON.stringify(successfulEvent));

      await waitForExpect(() => {
        expect(consumer).toHaveBeenCalledTimes(2);
        expect(consumer).toHaveBeenCalledWith({
          ...fromRedisMessage(failedEvent),
          id: expect.anything(),
        });
        expect(consumer).toHaveBeenCalledWith({
          ...fromRedisMessage(successfulEvent),
          id: expect.anything(),
        });
      });
    });
    it('should add the failed event to the consumer dead letter queue', async () => {
      await redis.del('MyConsumer-DLQ');

      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      });
      redisSubscribe(consumer, 'MyConsumer');

      await redis.xadd(streamName, '*', failedEvent.type, JSON.stringify(failedEvent));
      await redis.xadd(streamName, '*', successfulEvent.type, JSON.stringify(successfulEvent));

      await waitForExpect(async () => {
        const dlqStreamMessages = await redis.xread('COUNT', 1, 'STREAMS', 'MyConsumer-DLQ', 0);
        const [, dlqMessages] = dlqStreamMessages[0];
        const dlqMessage = dlqMessages[0];
        const [, messageValue] = dlqMessage;
        const [eventType, eventValue] = messageValue;
        const failedEventInDlq = JSON.parse(eventValue);

        expect(eventType).toEqual(failedEvent.type);
        expect(failedEventInDlq).toEqual(failedEvent);
      });
    });
  });

  describe('when subscribing to the stream after being disconnected', () => {
    it('should not be notified with events that were already managed by the same consumer', async () => {
      const redisFirstSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      });

      const firstConsumer = jest
        .fn<() => Promise<void>>()
        .mockImplementation(() => Promise.resolve());
      redisFirstSubscribe(firstConsumer, 'MyConsumer');

      const event1 = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      };
      await redis.xadd(streamName, '*', event1.type, JSON.stringify(event1));

      await waitForExpect(() => {
        expect(firstConsumer).toHaveBeenCalledTimes(1);
        expect(firstConsumer).toHaveBeenCalledWith({
          ...fromRedisMessage(event1),
          id: expect.anything(),
        });
      });

      const lastRedisSubscription = duplicatedRedisClients[duplicatedRedisClients.length - 1];
      lastRedisSubscription.disconnect(false);
      await waitForExpect(() => {
        expect(lastRedisSubscription.status).toBe('end');
      });

      const redisSecondSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      });
      const secondConsumer = jest
        .fn<() => Promise<void>>()
        .mockImplementation(() => Promise.resolve());
      redisSecondSubscribe(secondConsumer, 'MyConsumer');

      const event2 = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '3', projectIds: ['4', '5', '6'] },
        occurredAt: 5678,
      };
      await redis.xadd(streamName, '*', event1.type, JSON.stringify(event2));

      await waitForExpect(() => {
        expect(secondConsumer).toHaveBeenCalledTimes(1);
        expect(secondConsumer).not.toHaveBeenCalledWith({
          ...fromRedisMessage(event1),
          id: expect.anything(),
        });
        expect(secondConsumer).toHaveBeenCalledWith({
          ...fromRedisMessage(event2),
          id: expect.anything(),
        });
      });
    });
  });

  describe('when subscribing twice with the same consumer name', () => {
    it('should notify only first consumer', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      });

      const firstConsumer = jest
        .fn<() => Promise<void>>()
        .mockImplementation(() => Promise.resolve());
      redisSubscribe(firstConsumer, 'MyConsumer');

      const secondConsumer = jest
        .fn<() => Promise<void>>()
        .mockImplementation(() => Promise.resolve());
      redisSubscribe(secondConsumer, 'MyConsumer');

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      };
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event));

      await waitForExpect(() => {
        expect(secondConsumer).not.toHaveBeenCalled();
        expect(firstConsumer).toHaveBeenCalledTimes(5);
      });
    });
  });
});
