import { AggregateFromHistoryFn } from '.'
import { BaseDomainEvent, DomainEvent, EventStore, UniqueEntityID } from '../domain'
import { ok, okAsync, Result } from '../utils'
import {
  EntityAlreadyExistsError,
  EntityNotFoundError,
  HeterogeneousHistoryError,
  InfraNotAvailableError,
} from '../../modules/shared'
import { makeFakeEventStore } from '../../__tests__/fixtures/aggregates'
import { makeEventStoreTransactionalRepo } from './makeEventStoreTransactionalRepo'

interface DummyEventPayload {
  testId: string
}
class DummyEvent extends BaseDomainEvent<DummyEventPayload> implements DomainEvent {
  public static type: 'DummyEvent' = 'DummyEvent'
  public type = DummyEvent.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DummyEventPayload) {
    return payload.testId
  }
}

const fakeHistoryEvent = new DummyEvent({
  payload: {
    testId: '123',
  },
})

const fakeProducedEvent = new DummyEvent({
  payload: {
    testId: '123',
  },
})

describe('makeEventStoreTransactionalRepo', () => {
  describe('transaction()', () => {
    interface FakeAggregate {
      pendingEvents: readonly DomainEvent[]
      id: UniqueEntityID
      lastUpdatedOn: Date
      testFn: () => void
    }

    describe('when called for an existing aggregate that has a history', () => {
      const fakeAggregate: FakeAggregate = {
        pendingEvents: [fakeProducedEvent],
        id: new UniqueEntityID(''),
        lastUpdatedOn: new Date(0),
        testFn: jest.fn(),
      }
      const fakeMakeAggregate = jest.fn((args: { events?: DomainEvent[]; id: UniqueEntityID }) =>
        ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
      )

      const fakeLoadHistory = jest.fn((aggregateId: string) => {
        return okAsync<DomainEvent[], InfraNotAvailableError>([fakeHistoryEvent])
      })
      const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

      beforeAll(async () => {
        const repo = makeEventStoreTransactionalRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        const res = await repo.transaction(
          new UniqueEntityID('test'),
          (aggregate: FakeAggregate): Result<string, never> => {
            aggregate.testFn()
            return ok('correct')
          }
        )

        expect(res._unsafeUnwrap()).toEqual('correct')
      })

      it('should create an aggregate from the eventStore history', async () => {
        expect(fakeLoadHistory).toHaveBeenCalledWith('test')

        expect(fakeMakeAggregate).toHaveBeenCalledWith({
          events: [fakeHistoryEvent],
          id: new UniqueEntityID('test'),
        })
      })

      it('should execute the passed callback on the created aggregate', () => {
        expect(fakeAggregate.testFn).toHaveBeenCalled()
      })

      it('should publish any events that are pending in the aggregate', () => {
        expect(fakeEventStore.fakePublish).toHaveBeenCalledTimes(1)
        expect(fakeEventStore.fakePublish.mock.calls[0][0]).toEqual(fakeProducedEvent)
      })
    })

    describe('when called for an existing aggregate that has no history', () => {
      const fakeMakeAggregate: AggregateFromHistoryFn<FakeAggregate> = jest.fn()

      const fakeLoadHistory = jest.fn((aggregateId: string) => {
        return okAsync<DomainEvent[], InfraNotAvailableError>([])
      })
      const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

      it('should return a EntityNotFoundError', async () => {
        const repo = makeEventStoreTransactionalRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        const res = await repo.transaction(
          new UniqueEntityID('test'),
          (aggregate: FakeAggregate): Result<string, never> => {
            aggregate.testFn()
            return ok('correct')
          }
        )

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
      })
    })

    describe('when called with isNew=true on an aggregate that has no history', () => {
      const fakeAggregate: FakeAggregate = {
        pendingEvents: [fakeProducedEvent],
        id: new UniqueEntityID(''),
        lastUpdatedOn: new Date(0),
        testFn: jest.fn(),
      }
      const fakeMakeAggregate = jest.fn((args: { events?: DomainEvent[]; id: UniqueEntityID }) =>
        ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
      )

      const fakeLoadHistory = jest.fn((aggregateId: string) => {
        return okAsync<DomainEvent[], InfraNotAvailableError>([])
      })
      const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

      beforeAll(async () => {
        const repo = makeEventStoreTransactionalRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        const res = await repo.transaction(
          new UniqueEntityID('test'),
          (aggregate: FakeAggregate): Result<string, never> => {
            aggregate.testFn()
            return ok('correct')
          },
          { isNew: true }
        )

        expect(res._unsafeUnwrap()).toEqual('correct')
      })

      it('should create an aggregate without passing events', async () => {
        expect(fakeLoadHistory).toHaveBeenCalledWith('test')

        expect(fakeMakeAggregate).toHaveBeenCalledWith({
          id: new UniqueEntityID('test'),
        })
      })

      it('should execute the passed callback on the created aggregate', () => {
        expect(fakeAggregate.testFn).toHaveBeenCalled()
      })

      it('should publish any events that are pending in the aggregate', () => {
        expect(fakeEventStore.fakePublish).toHaveBeenCalledTimes(1)
        expect(fakeEventStore.fakePublish.mock.calls[0][0]).toEqual(fakeProducedEvent)
      })
    })

    describe('when called with isNew=true on an aggregate that has a history', () => {
      const fakeMakeAggregate: AggregateFromHistoryFn<FakeAggregate> = jest.fn()

      const fakeLoadHistory = jest.fn((aggregateId: string) => {
        return okAsync<DomainEvent[], InfraNotAvailableError>([fakeHistoryEvent])
      })
      const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

      it('should return a EntityAlreadyExistsError', async () => {
        const repo = makeEventStoreTransactionalRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        const res = await repo.transaction(
          new UniqueEntityID('test'),
          (aggregate: FakeAggregate): Result<string, never> => {
            aggregate.testFn()
            return ok('correct')
          },
          { isNew: true }
        )

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityAlreadyExistsError)
      })
    })

    describe('when called with acceptNew=true', () => {
      it('should accept an aggregate with no history', async () => {
        const fakeAggregate: FakeAggregate = {
          pendingEvents: [fakeProducedEvent],
          id: new UniqueEntityID(''),
          lastUpdatedOn: new Date(0),
          testFn: jest.fn(),
        }
        const fakeMakeAggregate = jest.fn((args: { events?: DomainEvent[]; id: UniqueEntityID }) =>
          ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
        )
        const fakeLoadHistory = jest.fn((aggregateId: string) => {
          return okAsync<DomainEvent[], InfraNotAvailableError>([])
        })
        const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

        const repo = makeEventStoreTransactionalRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        await repo.transaction(
          new UniqueEntityID('test'),
          (aggregate: FakeAggregate): Result<string, never> => {
            aggregate.testFn()
            return ok('correct')
          },
          { acceptNew: true }
        )

        expect(fakeMakeAggregate).toHaveBeenCalledWith({
          id: new UniqueEntityID('test'),
        })

        expect(fakeAggregate.testFn).toHaveBeenCalled()
      })

      it('should accept an aggregate that has a history', async () => {
        const fakeAggregate: FakeAggregate = {
          pendingEvents: [fakeProducedEvent],
          id: new UniqueEntityID(''),
          lastUpdatedOn: new Date(0),
          testFn: jest.fn(),
        }
        const fakeMakeAggregate = jest.fn((args: { events?: DomainEvent[]; id: UniqueEntityID }) =>
          ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
        )
        const fakeLoadHistory = jest.fn((aggregateId: string) => {
          return okAsync<DomainEvent[], InfraNotAvailableError>([fakeHistoryEvent])
        })
        const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

        const repo = makeEventStoreTransactionalRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        await repo.transaction(
          new UniqueEntityID('test'),
          (aggregate: FakeAggregate): Result<string, never> => {
            aggregate.testFn()
            return ok('correct')
          },
          { acceptNew: true }
        )

        expect(fakeMakeAggregate).toHaveBeenCalledWith({
          events: [fakeHistoryEvent],
          id: new UniqueEntityID('test'),
        })

        expect(fakeAggregate.testFn).toHaveBeenCalled()
      })
    })
  })
})
