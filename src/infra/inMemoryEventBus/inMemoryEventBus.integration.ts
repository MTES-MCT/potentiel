import { BaseDomainEvent, DomainEvent } from '../../core/domain'
import { makePublishInMemory, makeSubscribeToMemory } from './inMemoryEventBus'
import EventEmitter from 'events'

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
  const eventEmitter = new EventEmitter()
  const publishInMemory = makePublishInMemory({ eventEmitter })
  const subscribeToMemory = makeSubscribeToMemory({ eventEmitter })
  describe('publish', () => {
    it('should publish an event on the bus', async () => {
      const subscriber = jest.fn((event: DomainEvent) => {})

      await subscribeToMemory('DummyEvent', subscriber)

      const targetEvent = new DummyEvent({ payload: {} })
      await publishInMemory(targetEvent)

      expect(subscriber).toHaveBeenCalledTimes(1)
      expect(subscriber).toHaveBeenCalledWith(targetEvent)
    })
  })
})
