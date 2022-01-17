import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { makeInMemoryPublish, makeInMemorySubscribe } from './inMemoryEventBus'
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
  const inMemoryPublish = makeInMemoryPublish({ eventEmitter })
  const inMemorySubscribe = makeInMemorySubscribe({ eventEmitter })
  describe('inMemoryPublish', () => {
    it('should publish an event on the bus', async () => {
      const subscriber = jest.fn((event: DomainEvent) => {})

      await inMemorySubscribe('DummyEvent', subscriber)

      const targetEvent = new DummyEvent({ payload: {} })
      await inMemoryPublish(targetEvent)

      expect(subscriber).toHaveBeenCalledTimes(1)
      expect(subscriber).toHaveBeenCalledWith(targetEvent)
    })
  })
})
