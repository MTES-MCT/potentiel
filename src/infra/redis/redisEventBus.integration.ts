import { BaseDomainEvent, DomainEvent } from '../../core/domain'
import { makeRedisEventBus } from './redisEventBus'
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

describe('redisEventBus', () => {
  const redisClient = new Redis()

  beforeEach(async () => {
    await redisClient.del('potentiel_event_bus')
  })

  afterEach(async () => {
    await redisClient.quit()
  })

  describe('when publishing an event', () => {
    it('the puslihed event should be in the stream', async () => {
      const eventBus = makeRedisEventBus({ redisClient })

      const targetEvent = new DummyEvent({ payload: {} })
      await eventBus.publish(targetEvent)

      const results = await redisClient.xread('STREAMS', 'potentiel_event_bus', '0')

      const [key, messages] = results[0]
      expect(key).toEqual('potentiel_event_bus')
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
