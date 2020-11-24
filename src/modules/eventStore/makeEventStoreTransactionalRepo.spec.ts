import { EventStore } from '.'
import { UniqueEntityID } from '../../core/domain'
import { ok, okAsync, Result } from '../../core/utils'
import { makeFakeEventStore } from '../../__tests__/fixtures/aggregates'
import { PeriodeNotified } from '../project/events'
import { EntityNotFoundError, HeterogeneousHistoryError, InfraNotAvailableError } from '../shared'
import { EventStoreHistoryFilters } from './EventStore'
import { makeEventStoreTransactionalRepo } from './makeEventStoreTransactionalRepo'
import { StoredEvent } from './StoredEvent'

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
      pendingEvents: readonly StoredEvent[]
      id: UniqueEntityID
      lastUpdatedOn: Date
      testFn: () => void
    }
    const fakeAggregate: FakeAggregate = {
      pendingEvents: [fakeProducedEvent],
      id: new UniqueEntityID(''),
      lastUpdatedOn: new Date(0),
      testFn: jest.fn(),
    }
    const fakeMakeAggregate = jest.fn((args: { events: StoredEvent[]; id: UniqueEntityID }) =>
      ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
    )

    const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
      return okAsync<StoredEvent[], InfraNotAvailableError>([fakeHistoryEvent])
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

      expect(res.isOk()).toBe(true)
      if (res.isErr()) return

      expect(res.value).toEqual('correct')
    })

    it('should create an aggregate from the eventStore history', async () => {
      expect(fakeLoadHistory).toHaveBeenCalledWith({ aggregateId: 'test' })

      expect(fakeMakeAggregate).toHaveBeenCalledWith({
        events: [fakeHistoryEvent],
        id: new UniqueEntityID('test'),
      })

      expect(fakeEventStore.fakePublish).toHaveBeenCalledTimes(1)
      expect(fakeEventStore.fakePublish.mock.calls[0][0]).toEqual(fakeProducedEvent)
    })

    it('should execute the passed callback on the created aggregate', () => {
      expect(fakeAggregate.testFn).toHaveBeenCalled()
    })

    it('should publish any events that are pending in the aggregate', () => {
      expect(fakeEventStore.fakePublish).toHaveBeenCalledTimes(1)
      expect(fakeEventStore.fakePublish.mock.calls[0][0]).toEqual(fakeProducedEvent)
    })
  })
})
