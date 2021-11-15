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
    const loadAggregateEventsFromStore = jest.fn((aggregateId: string) =>
      okAsync<DomainEvent[], InfraNotAvailableError>([])
    )
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
})
