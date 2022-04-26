import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { makeRedisPublish } from './redisPublish'
import { toRedisMessage } from './helpers/toRedisMessage'
import Redis from 'ioredis'

interface DummyEventPayload {}
class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

const streamName = 'potentiel_event_bus'
const redis = new Redis(6380)

describe('redisPublish', () => {
  beforeEach(async () => {
    await redis.del(streamName)
  })

  afterAll(async () => {
    await redis.quit()
  })

  describe('when publishing an event', () => {
    it('the published event should be in the stream', async () => {
      const redisPublish = makeRedisPublish({ redis, streamName, streamMaxLength: 10000 })

      const targetEvent = new DummyEvent({ payload: {} })
      await redisPublish(targetEvent)

      const results = await redis.xread('STREAMS', streamName, '0')

      const [key, messages] = results[0]
      expect(key).toEqual(streamName)
      expect(messages).toHaveLength(1)

      const [messageKey, messageValue] = messages[0]
      expect(messageKey).not.toBeNull()

      const [eventType, eventValue] = messageValue
      expect(eventType).toEqual(targetEvent.constructor.name)

      const actualEventValue = JSON.parse(eventValue)
      expect(actualEventValue).toMatchObject(toRedisMessage(targetEvent))
    })
  })
})
