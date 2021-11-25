import { createClient } from 'redis'
import { BaseDomainEvent, DomainEvent } from '../../core/domain'
import { makeRedisEventBus } from './redisEventBus'

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
  const redisClient = createClient()
  const eventBus = makeRedisEventBus({ redisClient })

  describe('when publishing an event', () => {
    it('the puslihed event should be in the stream', async () => {
      const targetEvent = new DummyEvent({ payload: {} })
      await eventBus.publish(targetEvent)

      redisClient.connect()
      const streamsMessages = await redisClient.xRead({ key: 'potentiel_event_bus', id: '$' })

      expect(streamsMessages).not.toBeNull()
      expect(streamsMessages).toHaveLength(1)
      expect(streamsMessages[0].messages).toHaveLength(1)
    })
  })
})
