import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { InfraNotAvailableError } from '../../modules/shared'
import { BaseDomainEvent, DomainEvent, UniqueEntityID } from '../domain'

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
    const publishToEventBus = jest.fn((event: DomainEvent) =>
      okAsync<null, InfraNotAvailableError>(null)
    )
    const subscribe = jest.fn()

    const eventStore = makeEventStore({
      loadAggregateEventsFromStore,
      persistEventsToStore,
      publishToEventBus,
      subscribe,
    })

    const targetEvent = new DummyEvent({ payload: {} })

    beforeAll(async () => {
      await eventStore.publish(targetEvent)
    })
    it('should persist the event to the store', () => {
      expect(persistEventsToStore).toHaveBeenCalledTimes(1)
      expect(persistEventsToStore).toHaveBeenCalledWith([targetEvent])
    })
    it('should publish the event on the event bus', () => {
      expect(publishToEventBus).toHaveBeenCalledTimes(1)
      expect(publishToEventBus).toHaveBeenCalledWith(targetEvent)
    })
  })

  describe('subscribe', () => {
    const loadAggregateEventsFromStore = jest.fn()
    const persistEventsToStore = jest.fn()
    const publishToEventBus = jest.fn()
    const subscribe = jest.fn()

    const eventStore = makeEventStore({
      loadAggregateEventsFromStore,
      persistEventsToStore,
      publishToEventBus,
      subscribe,
    })

    const callback = (event: DomainEvent) => {}

    beforeAll(async () => {
      await eventStore.subscribe(DummyEvent.type, callback)
    })
    it('hook the callback to subscribe', () => {
      expect(subscribe).toHaveBeenCalledTimes(1)
      expect(subscribe).toHaveBeenCalledWith(DummyEvent.type, callback)
    })
  })

  describe('transaction', () => {
    describe('when everything is ok', () => {
      const loadAggregateEventsFromStore = jest.fn((aggregateId: string) =>
        okAsync<DomainEvent[], InfraNotAvailableError>([])
      )
      const persistEventsToStore = jest.fn((events: DomainEvent[]) =>
        okAsync<null, InfraNotAvailableError>(null)
      )
      const publishToEventBus = jest.fn((event: DomainEvent) =>
        okAsync<null, InfraNotAvailableError>(null)
      )
      const subscribe = jest.fn()

      const eventStore = makeEventStore({
        loadAggregateEventsFromStore,
        persistEventsToStore,
        publishToEventBus,
        subscribe,
      })

      const targetId = new UniqueEntityID().toString()
      const targetEvent = new DummyEvent({ payload: {} })

      const loadHistoryCallback = jest.fn((events: DomainEvent[]) => okAsync<null, never>(null))

      beforeAll(async () => {
        const res = await eventStore.transaction(({ loadHistory, publish }) => {
          return loadHistory(targetId)
            .andThen(loadHistoryCallback)
            .map(() => publish(targetEvent))
            .map(() => 'hello')
        })

        expect(res._unsafeUnwrap()).toEqual('hello')
      })

      it('should load aggregate events from the store', () => {
        expect(loadAggregateEventsFromStore).toHaveBeenCalledTimes(1)
        expect(loadAggregateEventsFromStore).toHaveBeenCalledWith(targetId)
      })

      it('should persist the event in the store', () => {
        expect(persistEventsToStore).toHaveBeenCalledTimes(1)
        expect(persistEventsToStore).toHaveBeenCalledWith([targetEvent])
      })
      it('should publish the event on the event bus', () => {
        expect(publishToEventBus).toHaveBeenCalledTimes(1)
        expect(publishToEventBus).toHaveBeenCalledWith(targetEvent)
      })
    })

    describe('when loadAggregateEventsFromStore fails', () => {
      const loadAggregateEventsFromStore = jest.fn((aggregateId: string) =>
        errAsync<DomainEvent[], InfraNotAvailableError>(new InfraNotAvailableError())
      )
      const persistEventsToStore = jest.fn((events: DomainEvent[]) =>
        okAsync<null, InfraNotAvailableError>(null)
      )
      const publishToEventBus = jest.fn((event: DomainEvent) =>
        okAsync<null, InfraNotAvailableError>(null)
      )
      const subscribe = jest.fn()

      const eventStore = makeEventStore({
        loadAggregateEventsFromStore,
        persistEventsToStore,
        publishToEventBus,
        subscribe,
      })

      const targetId = new UniqueEntityID().toString()
      const targetEvent = new DummyEvent({ payload: {} })

      const loadHistoryCallback = jest.fn((events: DomainEvent[]) => okAsync<null, never>(null))

      beforeAll(async () => {
        const res = await eventStore.transaction(({ loadHistory, publish }) => {
          return loadHistory(targetId)
            .andThen(loadHistoryCallback)
            .map(() => publish(targetEvent))
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(InfraNotAvailableError)
      })

      it('should not persist the event in the store', () => {
        expect(persistEventsToStore).not.toHaveBeenCalled()
      })

      it('should not publish the event on the event bus', () => {
        expect(publishToEventBus).not.toHaveBeenCalled()
      })
    })

    describe('when persistEventsToStore fails', () => {
      const loadAggregateEventsFromStore = jest.fn((aggregateId: string) =>
        okAsync<DomainEvent[], InfraNotAvailableError>([])
      )
      const persistEventsToStore = jest.fn((events: DomainEvent[]) =>
        errAsync<null, InfraNotAvailableError>(new InfraNotAvailableError())
      )
      const publishToEventBus = jest.fn((event: DomainEvent) =>
        okAsync<null, InfraNotAvailableError>(null)
      )
      const subscribe = jest.fn()

      const eventStore = makeEventStore({
        loadAggregateEventsFromStore,
        persistEventsToStore,
        publishToEventBus,
        subscribe,
      })

      const targetId = new UniqueEntityID().toString()
      const targetEvent = new DummyEvent({ payload: {} })

      const loadHistoryCallback = jest.fn((events: DomainEvent[]) => okAsync<null, never>(null))

      beforeAll(async () => {
        const res = await eventStore.transaction(({ loadHistory, publish }) => {
          return loadHistory(targetId)
            .andThen(loadHistoryCallback)
            .map(() => publish(targetEvent))
        })

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(InfraNotAvailableError)
      })

      it('should not publish the event on the event bus', () => {
        expect(publishToEventBus).not.toHaveBeenCalled()
      })
    })
  })
})
