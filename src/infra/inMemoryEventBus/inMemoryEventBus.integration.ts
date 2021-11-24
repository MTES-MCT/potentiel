import { BaseDomainEvent, DomainEvent } from '../../core/domain'
import { makeInMemoryEventBus } from './inMemoryEventBus'

interface DummyEventPayload {}
class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

describe('inMemoryEventBus', () => {
  const eventBus = makeInMemoryEventBus()
  describe('publish', () => {
    it('should publish an event on the bus', async () => {
      const subscriber = jest.fn((event: DomainEvent) => {})

      await eventBus.subscribe('DummyEvent', subscriber)

      const targetEvent = new DummyEvent({ payload: {} })
      await eventBus.publish(targetEvent)

      expect(subscriber).toHaveBeenCalledTimes(1)
      expect(subscriber).toHaveBeenCalledWith(targetEvent)
    })
  })
})
