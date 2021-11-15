import {
  DomainEvent,
  UniqueEntityID,
  EventStoreHistoryFilters,
  EventStore,
  BaseDomainEvent,
} from '../../core/domain'
import { ok, okAsync } from '../../core/utils'
import { makeFakeEventStore } from '../../__tests__/fixtures/aggregates'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  HeterogeneousHistoryError,
  InfraNotAvailableError,
} from '../../modules/shared'
import { makeEventStoreRepo } from './makeEventStoreRepo'

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

const projectId = new UniqueEntityID('project1')

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

interface FakeAggregate {
  pendingEvents: DomainEvent[]
  lastUpdatedOn: Date
  id: UniqueEntityID
}

describe('makeEventStoreRepo', () => {
  describe('load(id)', () => {
    const fakeAggregate: FakeAggregate = {
      pendingEvents: [fakeProducedEvent],
      lastUpdatedOn: new Date(0),
      id: projectId,
    }
    const fakeMakeAggregate = jest.fn((args: { events: DomainEvent[]; id: UniqueEntityID }) =>
      ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
    )

    const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
      return okAsync<DomainEvent[], InfraNotAvailableError>([fakeHistoryEvent])
    })
    const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

    it('call the aggregate function with the loaded history', async () => {
      const repo = makeEventStoreRepo({
        eventStore: fakeEventStore as EventStore,
        makeAggregate: fakeMakeAggregate,
      })

      const res = await repo.load(projectId)

      expect(res.isOk()).toBe(true)
      if (res.isErr()) return

      expect(fakeLoadHistory).toHaveBeenCalledWith({ aggregateId: projectId.toString() })
      expect(fakeMakeAggregate).toHaveBeenCalledWith({ events: [fakeHistoryEvent], id: projectId })
    })
  })

  describe('save(aggregate)', () => {
    describe('when aggregate is the latest version', () => {
      const fakeAggregate: FakeAggregate = {
        pendingEvents: [fakeProducedEvent],
        id: projectId,
        lastUpdatedOn: new Date(0),
      }
      const fakeMakeAggregate = jest.fn((args: { events: DomainEvent[]; id: UniqueEntityID }) =>
        ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeAggregate)
      )

      const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
        return okAsync<DomainEvent[], InfraNotAvailableError>([fakeHistoryEvent])
      })
      const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

      it('should publish any events that are pending in the aggregate', async () => {
        const repo = makeEventStoreRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        const res = await repo.save(fakeAggregate)

        expect(res.isOk()).toBe(true)
        if (res.isErr()) return

        expect(fakeEventStore.fakePublish).toHaveBeenCalledTimes(1)
        expect(fakeEventStore.fakePublish.mock.calls[0][0]).toEqual(fakeProducedEvent)
      })
    })

    describe('when aggregate has a newer version', () => {
      const fakeNewerAggregate: FakeAggregate = {
        pendingEvents: [],
        id: projectId,
        lastUpdatedOn: new Date(1), // notice date is 1
      }
      const fakeMakeAggregate = jest.fn((args: { events: DomainEvent[]; id: UniqueEntityID }) =>
        ok<FakeAggregate, EntityNotFoundError | HeterogeneousHistoryError>(fakeNewerAggregate)
      )

      const fakeLoadHistory = jest.fn((filters?: EventStoreHistoryFilters) => {
        return okAsync<DomainEvent[], InfraNotAvailableError>([fakeHistoryEvent])
      })
      const fakeEventStore = makeFakeEventStore(fakeLoadHistory)

      it('should return AggregateHasBeenUpdatedSinceError', async () => {
        const repo = makeEventStoreRepo({
          eventStore: fakeEventStore as EventStore,
          makeAggregate: fakeMakeAggregate,
        })

        const fakeAggregate: FakeAggregate = {
          pendingEvents: [fakeProducedEvent],
          id: projectId,
          lastUpdatedOn: new Date(0), // saved aggregate date is 0 (earlier that fakeNewerAggregate)
        }

        const res = await repo.save(fakeAggregate)

        expect(res.isErr()).toBe(true)
        if (res.isOk()) return

        expect(res.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)

        expect(fakeEventStore.fakePublish).not.toHaveBeenCalled()
      })
    })
  })
})
