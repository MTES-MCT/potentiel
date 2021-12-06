import Redis from 'ioredis'
import { Redis as RedisType } from 'ioredis'
import { makeSubscribeToStream } from './redisSubscribe'
import { UserProjectsLinkedByContactEmail } from '../../modules/authZ'
import { fromRedisMessage } from './helpers/fromRedisMessage'

describe('redisSubscribe', () => {
  const streamName = 'potentiel-event-bus-subscribe-tests'
  const redis = new Redis({ port: 6380, lazyConnect: true, showFriendlyErrorStack: true })
  const duplicatedRedisClients: RedisType[] = []

  const redisDependency = {
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
    it('should be notified with all events added to it', async () => {
      const redisSubscribe = makeSubscribeToStream({
        redis: redisDependency,
        streamName,
      })

      const consumer = jest.fn()

      await redisSubscribe(consumer, 'MyConsumer')
      await waitFor(50)

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await waitFor(50)
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await waitFor(50)

      expect(consumer).toHaveBeenCalledTimes(2)
      expect(consumer).toHaveBeenNthCalledWith(2, {
        ...fromRedisMessage(event),
        id: expect.anything(),
      })
    })
  })

  describe('when subscribing after some messages were added to the stream', () => {
    it('should be notified with all events added to it', async () => {
      const redisSubscribe = makeSubscribeToStream({
        redis: redisDependency,
        streamName,
      })

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await waitFor(50)
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await waitFor(50)

      const consumer = jest.fn()
      redisSubscribe(consumer, 'MyConsumer')
      await waitFor(1000)

      expect(consumer).toHaveBeenCalledTimes(2)
      expect(consumer).toHaveBeenNthCalledWith(2, {
        ...fromRedisMessage(event),
        id: expect.anything(),
      })
    })
  })

  describe('when the consumer failed to handle the event', () => {
    it('should be notified again with the event on which failed first time', async () => {
      const redisSubscribe = makeSubscribeToStream({
        redis: redisDependency,
        streamName,
      })

      const consumer = jest.fn().mockImplementationOnce(() => {
        throw new Error()
      })
      redisSubscribe(consumer, 'MyConsumer')
      await waitFor(50)

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await waitFor(50)

      expect(consumer).toHaveBeenCalledTimes(2)
      expect(consumer).toHaveBeenNthCalledWith(2, {
        ...fromRedisMessage(event),
        id: expect.anything(),
      })
    })
  })

  describe('when subscribing to the stream after being disconnected', () => {
    it('should not be notified with events that were already managed by the consumer', async () => {
      const redisSubscribe = makeSubscribeToStream({
        redis: redisDependency,
        streamName,
      })

      redisSubscribe(jest.fn(), 'MyConsumer')
      await waitFor(50)

      const event = {
        type: UserProjectsLinkedByContactEmail.type,
        payload: { userId: '2', projectIds: ['1', '2', '3'] },
        occurredAt: 1234,
      }
      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await waitFor(50)

      const lastRedisSubscription = duplicatedRedisClients[duplicatedRedisClients.length - 1]
      lastRedisSubscription.disconnect()
      await waitFor(50)

      const consumer = jest.fn()
      redisSubscribe(consumer, 'MyConsumer')
      await waitFor(50)

      await redis.xadd(streamName, '*', event.type, JSON.stringify(event))
      await waitFor(50)

      expect(consumer).toHaveBeenCalledTimes(1)
      expect(consumer).toHaveBeenNthCalledWith(1, {
        ...fromRedisMessage(event),
        id: expect.anything(),
      })
    })
  })
})

const waitFor = (ms) => new Promise((res) => setTimeout(res, ms))
