import { createClient } from 'redis'
import { BaseDomainEvent, DomainEvent } from '../../core/domain'
import { makeRedisEventBus } from './redisEventBus'
import { toRedisTuple } from './helpers/toRedisTuple'

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
  let redisClient: RedisClient

  beforeAll(async () => {
    redisClient = createClient()
    await redisClient.connect()
    await redisClient.del('potentiel_event_bus')
  })

  afterAll(async () => {
    await redisClient.quit()
  })

  describe('when publishing an event', () => {
    it('the puslihed event should be in the stream', async () => {
      const eventBus = makeRedisEventBus({ redisClient })

      const targetEvent = new DummyEvent({ payload: {} })
      await eventBus.publish(targetEvent)

      const streamsMessages = await redisClient.xRead({ key: 'potentiel_event_bus', id: '0' })
      expect(streamsMessages).not.toBeNull()
      expect(streamsMessages).toHaveLength(1)
      expect(streamsMessages[0].messages).toHaveLength(1)
      expect(streamsMessages[0].messages[0].message).toMatchObject(toRedisTuple(targetEvent))
    })
  })
})
