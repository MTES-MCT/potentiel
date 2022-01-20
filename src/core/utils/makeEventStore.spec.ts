import { errAsync, okAsync, ResultAsync } from 'neverthrow'
import { wrapInfra } from '.'
import { InfraNotAvailableError } from '@modules/shared'
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
  const rollbackEventsFromStore = jest.fn()

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
      rollbackEventsFromStore,
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
      rollbackEventsFromStore,
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
        rollbackEventsFromStore,
        publishToEventBus,
        subscribe,
      })

      const targetId = new UniqueEntityID()
      const targetEvent = new DummyEvent({ payload: {} })

      const transactionCallback = jest.fn((aggregateEvents: DomainEvent[]) =>
        okAsync<DomainEvent[], never>([targetEvent])
      )

      beforeAll(async () => {
        const res = await eventStore.transaction(targetId, transactionCallback)

        expect(res.isOk()).toBe(true)
      })

      it('should load aggregate events from the store', () => {
        expect(loadAggregateEventsFromStore).toHaveBeenCalledTimes(1)
        expect(loadAggregateEventsFromStore).toHaveBeenCalledWith(targetId.toString())
      })

      it('should persist the returned events in the store', () => {
        expect(persistEventsToStore).toHaveBeenCalledTimes(1)
        expect(persistEventsToStore).toHaveBeenCalledWith([targetEvent])
      })
      it('should publish the returned events on the event bus', () => {
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
        rollbackEventsFromStore,
        publishToEventBus,
        subscribe,
      })

      const targetId = new UniqueEntityID()
      const targetEvent = new DummyEvent({ payload: {} })

      const transactionCallback = jest.fn((aggregateEvents: DomainEvent[]) =>
        okAsync<DomainEvent[], never>([targetEvent])
      )

      beforeAll(async () => {
        const res = await eventStore.transaction(targetId, transactionCallback)

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
        rollbackEventsFromStore,
        publishToEventBus,
        subscribe,
      })

      const targetId = new UniqueEntityID()
      const targetEvent = new DummyEvent({ payload: {} })

      const transactionCallback = jest.fn((aggregateEvents: DomainEvent[]) =>
        okAsync<DomainEvent[], never>([targetEvent])
      )
      beforeAll(async () => {
        const res = await eventStore.transaction(targetId, transactionCallback)

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(InfraNotAvailableError)
      })

      it('should not publish the event on the event bus', () => {
        expect(publishToEventBus).not.toHaveBeenCalled()
      })
    })

    describe('when publishToEventBus fails', () => {
      const loadAggregateEventsFromStore = jest.fn((aggregateId: string) =>
        okAsync<DomainEvent[], InfraNotAvailableError>([])
      )
      const persistEventsToStore = jest.fn((events: DomainEvent[]) =>
        okAsync<null, InfraNotAvailableError>(null)
      )
      const publishToEventBus = jest.fn((event: DomainEvent) =>
        errAsync<null, InfraNotAvailableError>(new InfraNotAvailableError())
      )
      const subscribe = jest.fn()

      const eventStore = makeEventStore({
        loadAggregateEventsFromStore,
        persistEventsToStore,
        rollbackEventsFromStore,
        publishToEventBus,
        subscribe,
      })

      const targetId = new UniqueEntityID()
      const targetEvent = new DummyEvent({ payload: {} })

      const transactionCallback = jest.fn((aggregateEvents: DomainEvent[]) =>
        okAsync<DomainEvent[], never>([targetEvent])
      )
      beforeAll(async () => {
        const res = await eventStore.transaction(targetId, transactionCallback)

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(InfraNotAvailableError)
      })

      it('should rollback the persisted events from the store', () => {
        expect(persistEventsToStore).toHaveBeenCalledWith([targetEvent])
        expect(rollbackEventsFromStore).toHaveBeenCalledWith([targetEvent])
      })
    })

    describe('when multiple calls are made at the same time', () => {
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

      const targetId = new UniqueEntityID()

      const eventStore = makeEventStore({
        loadAggregateEventsFromStore,
        persistEventsToStore,
        rollbackEventsFromStore,
        publishToEventBus,
        subscribe,
      })

      it('should wait for the first to finish before handling the second (concurrency lock)', async () => {
        const { promise: promise1, resolve: resolve1 } = makeFakePromise()
        const callback1 = jest.fn(() => {
          return wrapInfra(promise1).map(() => []) // This will hang until resolve1 has been called
        })
        const callback2 = jest.fn(() => okAsync([]))
        const transaction1 = eventStore.transaction(targetId, callback1)
        eventStore.transaction(targetId, callback2)

        expect(callback2).not.toHaveBeenCalled()

        resolve1()
        await transaction1

        expect(callback1).toHaveBeenCalled()
        expect(callback2).toHaveBeenCalled()
      })
    })
  })
})

const makeFakePromise = () => {
  let greenLight = false
  const promise = new Promise((resolve) => {
    const interval = setInterval(() => {
      if (greenLight) {
        resolve(null)
        clearInterval(interval)
      }
    }, 100)
  })

  return {
    promise,
    resolve: () => {
      greenLight = true
    },
  }
}
