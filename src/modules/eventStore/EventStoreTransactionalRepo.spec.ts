import { EventStore, EventStoreTransactionArgs } from '.'
import { UniqueEntityID } from '../../core/domain'
import { ok, okAsync, Result, ResultAsync } from '../../core/utils'
import { PeriodeNotified } from '../project/events'
import { EntityNotFoundError, HeterogeneousHistoryError, InfraNotAvailableError } from '../shared'
import { EventStoreHistoryFilters } from './EventStore'
import { EventStoreTransactionalRepo } from './EventStoreTransactionalRepo'
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

describe('EventStoreTransactionalRepo', () => {
  describe('transaction()', () => {
    interface FakeAggregate {
      pendingEvents: StoredEvent[]
      testFn: () => void
    }
    const fakeAggregate: FakeAggregate = {
      pendingEvents: [fakeProducedEvent],
      testFn: jest.fn(),
    }
    const fakeMakeAggregate = jest.fn((events: StoredEvent[]) =>
      ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
    )

    const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
      return okAsync<StoredEvent[], InfraNotAvailableError>([fakeHistoryEvent])
    })
    const fakePublish = jest.fn((event: StoredEvent) => {})
    const fakeEventStore: EventStore = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      transaction: <T>(fn: (args: EventStoreTransactionArgs) => T) => {
        return ResultAsync.fromPromise(
          Promise.resolve(fn({ loadHistory: fakeLoadHistory, publish: fakePublish })),
          () => new InfraNotAvailableError()
        )
      },
    }

    beforeAll(async () => {
      const repo = new EventStoreTransactionalRepo(fakeEventStore, fakeMakeAggregate)

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

      expect(fakeMakeAggregate).toHaveBeenCalledWith([fakeHistoryEvent])

      expect(fakePublish).toHaveBeenCalledTimes(1)
      expect(fakePublish.mock.calls[0][0]).toEqual(fakeProducedEvent)
    })

    it('should execute the passed callback on the created aggregate', () => {
      expect(fakeAggregate.testFn).toHaveBeenCalled()
    })

    it('should publish any events that are pending in the aggregate', () => {
      expect(fakePublish).toHaveBeenCalledTimes(1)
      expect(fakePublish.mock.calls[0][0]).toEqual(fakeProducedEvent)
    })
  })
})
