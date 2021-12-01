import Redis from 'ioredis'
import { Redis as RedisType } from 'ioredis'
import { makeSubscribeToStream } from './subscribeToStream'
import { UserProjectsLinkedByContactEmail } from '../../modules/authZ'
import { Stream } from 'stream'

describe('subscribeToStream', () => {
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
      const subscribeToStream = makeSubscribeToStream({
        redis: redisDependency,
        streamName,
      })

      const consumer = jest.fn()

      await subscribeToStream(consumer, 'MyConsumer')
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
    })
  })

  describe('when subscribing after some messages were added to the stream', () => {
    it('should be notified with all events added to it', async () => {
      const subscribeToStream = makeSubscribeToStream({
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
      subscribeToStream(consumer, 'MyConsumer')
      await waitFor(1000)

      expect(consumer).toHaveBeenCalledTimes(2)
    })
  })
})

const waitFor = (ms) => new Promise((res) => setTimeout(res, ms))
