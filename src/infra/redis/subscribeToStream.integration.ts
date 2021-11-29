import Redis from 'ioredis'
import { Redis as RedisType } from 'ioredis'
import { makeSubscribeToStream } from './subscribeToStream'
import { UserProjectsLinkedByContactEmail } from '../../modules/authZ'

const streamName = 'potentiel-event-bus-subscribe-tests'
const redis = new Redis(6380)
const duplicatedRedisClients: RedisType[] = []
const redisDependency = {
  duplicate: () => {
    const newRedis = redis.duplicate()
    duplicatedRedisClients.push(newRedis)
    return newRedis
  },
} as RedisType

describe('redisEventBus.subscribe', () => {
  beforeAll(async () => {
    await redis.del(streamName)
  })

  afterEach(() => duplicatedRedisClients.map((r) => r.status !== 'end' && r.disconnect()))

  afterAll(async () => {
    await redis.quit()
  })

  describe('when subscribing to a stream', () => {
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
      await redis.xadd(streamName, 1, event.type, JSON.stringify(event))
      await waitFor(50)
      await redis.xadd(streamName, 2, event.type, JSON.stringify(event))
      await waitFor(50)

      expect(consumer).toHaveBeenCalledTimes(2)
    })
  })
})

const waitFor = (ms) => new Promise((res) => setTimeout(res, ms))
