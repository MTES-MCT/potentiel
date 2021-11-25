import { DomainEvent, EventStore, EventStoreAggregate, Repository, UniqueEntityID } from '../domain'
import { err, errAsync, ok, okAsync, Result, ResultAsync } from '../utils'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  HeterogeneousHistoryError,
} from '../../modules/shared'

type AggregateFromHistoryFn<T> = (args: {
  events: DomainEvent[]
  id: UniqueEntityID
}) => Result<T, EntityNotFoundError | HeterogeneousHistoryError>

export const makeEventStoreRepo = <T extends EventStoreAggregate>(deps: {
  eventStore: EventStore
  makeAggregate: AggregateFromHistoryFn<T>
}): Repository<T> => ({
  load(id: UniqueEntityID) {
    let events: DomainEvent[] = []
    return deps.eventStore
      .transaction(id, (aggregateEvents) => {
        events = aggregateEvents
        return okAsync<DomainEvent[], never>([])
      })
      .andThen(() => deps.makeAggregate({ events, id }))
  },

  save(aggregate: T) {
    if (!aggregate.pendingEvents.length) return okAsync(null)

    return deps.eventStore.transaction(aggregate.id, (events) => {
      return deps.makeAggregate({ events, id: aggregate.id }).asyncAndThen(
        (
          newestAggregate: T
        ): ResultAsync<readonly DomainEvent[], AggregateHasBeenUpdatedSinceError> => {
          const aggregateHasBeenUpdated =
            newestAggregate.lastUpdatedOn &&
            aggregate.lastUpdatedOn &&
            newestAggregate.lastUpdatedOn > aggregate.lastUpdatedOn
          if (aggregateHasBeenUpdated) {
            // Return error if aggregate has a newer version
            return errAsync(new AggregateHasBeenUpdatedSinceError())
          }

          return okAsync(aggregate.pendingEvents)
        }
      )
    })
  },
})
