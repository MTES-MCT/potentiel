import { AggregateFromHistoryFn, EventStore } from '.'
import { DomainEvent, Entity, UniqueEntityID } from '../../core/domain'
import { ok, okAsync, Result } from '../../core/utils'
import { makeFakeEventStore } from '../../__tests__/fixtures/aggregates'
import { PeriodeNotified } from '../project/events'
import {
  EntityAlreadyExistsError,
  EntityNotFoundError,
  HeterogeneousHistoryError,
  InfraNotAvailableError,
} from '../shared'
import { EventStoreHistoryFilters } from './EventStore'
import { makeEventStoreTransactionalRepo } from './makeEventStoreTransactionalRepo'

const fakeHistoryEvent = new PeriodeNotified({
  payload: {
    periodeId: 'periode',
    appelOffreId: 'appelOffre',
    notifiedOn: 123,
    requestedBy: 'user1',
  },
})

const fakeProducedEvent = new PeriodeNotified({
  payload: {
    periodeId: 'periode',
    appelOffreId: 'appelOffre',
    notifiedOn: 123,
    requestedBy: 'user1',
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

      const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
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
        expect(fakeLoadHistory).toHaveBeenCalledWith({ aggregateId: 'test' })

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

    describe('when called for a new aggregate that has no history', () => {
      const fakeAggregate: FakeAggregate = {
        pendingEvents: [fakeProducedEvent],
        id: new UniqueEntityID(''),
        lastUpdatedOn: new Date(0),
        testFn: jest.fn(),
      }
      const fakeMakeAggregate = jest.fn((args: { events?: DomainEvent[]; id: UniqueEntityID }) =>
        ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
      )

      const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
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
        expect(fakeLoadHistory).toHaveBeenCalledWith({ aggregateId: 'test' })

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

    describe('when called for an existing aggregate that has no history', () => {
      const fakeMakeAggregate: AggregateFromHistoryFn<FakeAggregate> = jest.fn()

      const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
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

    describe('when called for a new aggregate that has a history', () => {
      const fakeMakeAggregate: AggregateFromHistoryFn<FakeAggregate> = jest.fn()

      const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
        return okAsync<DomainEvent[], InfraNotAvailableError>([fakeHistoryEvent])
      })
      const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

      it('should return a EntityAlreadyExistsError', async () => {
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
  })
})
