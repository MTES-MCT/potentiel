import { okAsync } from 'neverthrow'
import { InfraNotAvailableError } from '../../modules/shared'
import { BaseDomainEvent, DomainEvent } from '../domain'

import { makeEventStore } from './makeEventStore'

interface DummyEventPayload {}
class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return undefined
  }
}

describe('makeEventStore', () => {
  describe('publish', () => {
    const loadAggregateEventsFromStore = jest.fn()
    const persistEventsToStore = jest.fn((events: DomainEvent[]) =>
      okAsync<null, InfraNotAvailableError>(null)
    )
    const emitEvent = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))
    const listenToEvents = jest.fn()

    const eventStore = makeEventStore({
      loadAggregateEventsFromStore,
      persistEventsToStore,
      emitEvent,
      listenToEvents,
    })

    const targetEvent = new DummyEvent({ payload: {} })

    beforeAll(async () => {
      await eventStore.publish(targetEvent)
    })
    it('should persist the event to the store', () => {
      expect(persistEventsToStore).toHaveBeenCalledTimes(1)
      expect(persistEventsToStore).toHaveBeenCalledWith([targetEvent])
    })
    it('should emit the event', () => {
      expect(emitEvent).toHaveBeenCalledTimes(1)
      expect(emitEvent).toHaveBeenCalledWith(targetEvent)
    })
  })

  describe('subscribe', () => {
    const loadAggregateEventsFromStore = jest.fn()
    const persistEventsToStore = jest.fn()
    const emitEvent = jest.fn()
    const listenToEvents = jest.fn((eventClass, cb: (event: DomainEvent) => unknown) =>
      okAsync<null, InfraNotAvailableError>(null)
    )

    const eventStore = makeEventStore({
      loadAggregateEventsFromStore,
      persistEventsToStore,
      emitEvent,
      listenToEvents,
    })

    const targetEvent = new DummyEvent({ payload: {} })

    const callback = (event: DomainEvent) => {}

    beforeAll(async () => {
      await eventStore.subscribe(DummyEvent.type, callback)
    })
    it('hook the callback to listenToEvents', () => {
      expect(listenToEvents).toHaveBeenCalledTimes(1)
      expect(listenToEvents).toHaveBeenCalledWith(DummyEvent.type, callback)
    })
  })
})
