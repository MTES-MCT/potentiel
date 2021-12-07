import Redis from 'ioredis'
import { Redis as RedisType } from 'ioredis'
import { makeRedisSubscribe } from './redisSubscribe'
import { UserProjectsLinkedByContactEmail } from '../../modules/authZ'
import { fromRedisMessage } from './helpers/fromRedisMessage'
import waitForExpect from 'wait-for-expect'

describe('redisSubscribe', () => {
  const streamName = 'potentiel-event-bus-subscribe-tests'
  const redis = new Redis({ port: 6380, lazyConnect: true, showFriendlyErrorStack: true })
  const duplicatedRedisClients: RedisType[] = []

  const redisDependency = {
    ...redis.duplicate(),
    duplicate: () => {
      const newRedis = redis.duplicate()
      duplicatedRedisClients.push(newRedis)
      return newRedis
    },
  } as RedisType

  afterEach(async () => {
    await redis.del(streamName)
    duplicatedRedisClients.map((r) => r.status !== 'end' && r.disconnect())
  })

  afterAll(async () => {
    await redis.quit()
  })

  describe('when subscribing before some messages were added to the stream', () => {
    it('should be called with the events that were published after subscription', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      })

      const consumer = jest.fn()

      redisSubscribe(consumer, 'MyConsumer')

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))

      await waitForExpect(() => {
        expect(consumer).toHaveBeenCalledTimes(2)
        expect(consumer).toHaveBeenNthCalledWith(2, {
          ...fromRedisMessage(event),
          id: expect.anything(),
        })
      })
    })
  })

  describe('when subscribing after some messages were added to the stream', () => {
    it('should be called with the events the were in the stream before the subscription', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      })

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))

      const consumer = jest.fn()
      redisSubscribe(consumer, 'MyConsumer')

      await waitForExpect(() => {
        expect(consumer).toHaveBeenCalledTimes(2)
        expect(consumer).toHaveBeenNthCalledWith(2, {
          ...fromRedisMessage(event),
          id: expect.anything(),
        })
      })
    })
  })

  describe('when the consumer failed to handle the event', () => {
    it('should be notified again with the event on which failed first time', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      })

      const consumer = jest.fn().mockImplementationOnce(() => {
        throw new Error()
      })
      redisSubscribe(consumer, 'MyConsumer')

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))

      await waitForExpect(() => {
        expect(consumer).toHaveBeenCalledTimes(2)
        expect(consumer).toHaveBeenNthCalledWith(2, {
          ...fromRedisMessage(event),
          id: expect.anything(),
        })
      })
    })
  })

  describe('when subscribing to the stream after being disconnected', () => {
    it('should not be notified with events that were already managed by the same consumer', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      })

      const firstConsumer = jest.fn()
      redisSubscribe(firstConsumer, 'MyConsumer')

      const event1 = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event1.type, JSON.stringify(event1))

      await waitForExpect(() => {
        expect(firstConsumer).toHaveBeenCalledTimes(1)
        expect(firstConsumer).toHaveBeenCalledWith({
          ...fromRedisMessage(event1),
          id: expect.anything(),
        })
      })

      const lastRedisSubscription = duplicatedRedisClients[duplicatedRedisClients.length - 1]
      lastRedisSubscription.disconnect(false)

      await waitForExpect(() => {
        expect(lastRedisSubscription.status).toBe('end')
      })

      const secondConsumer = jest.fn()
      redisSubscribe(secondConsumer, 'MyConsumer')

      const event2 = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '3', projectIds: ['4', '5', '6'] },
        occurredAt: 5678,
      }
      await redis.xadd(streamName, '*', event1.type, JSON.stringify(event2))

      await waitForExpect(() => {
        expect(secondConsumer).toHaveBeenCalledTimes(1)
        expect(secondConsumer).not.toHaveBeenCalledWith({
          ...fromRedisMessage(event1),
          id: expect.anything(),
        })
        expect(secondConsumer).toHaveBeenCalledWith({
          ...fromRedisMessage(event2),
          id: expect.anything(),
        })
      })
    })
  })

  describe('when subscribing twice with the same consumer name', () => {
    it('should notify only first consumer', async () => {
      const redisSubscribe = makeRedisSubscribe({
        redis: redisDependency,
        streamName,
      })

      const firstConsumer = jest.fn()
      redisSubscribe(firstConsumer, 'MyConsumer')

      const secondConsumer = jest.fn()
      redisSubscribe(secondConsumer, 'MyConsumer')

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))

      await waitForExpect(() => {
        expect(secondConsumer).not.toHaveBeenCalled()
        expect(firstConsumer).toHaveBeenCalledTimes(5)
      })
    })
  })
})
