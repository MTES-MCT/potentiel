import {
  DomainEvent,
  Repository,
  UniqueEntityID,
  EventStore,
  EventStoreAggregate,
} from '../../core/domain'
import { err, ok, okAsync, Result, unwrapResultOfResult } from '../../core/utils'
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
    return deps.eventStore
      .transaction(({ loadHistory }) => loadHistory(id.toString()))
      .andThen(unwrapResultOfResult)
      .andThen((events) => deps.makeAggregate({ events, id }))
  },

  save(aggregate: T) {
    if (!aggregate.pendingEvents.length) return okAsync(null)

    return deps.eventStore
      .transaction(({ loadHistory, publish }) => {
        return loadHistory(aggregate.id.toString())
          .andThen((events) => deps.makeAggregate({ events, id: aggregate.id }))
          .andThen(
            (newestAggregate: T): Result<null, AggregateHasBeenUpdatedSinceError> => {
              const aggregateHasBeenUpdated =
                newestAggregate.lastUpdatedOn &&
                aggregate.lastUpdatedOn &&
                newestAggregate.lastUpdatedOn > aggregate.lastUpdatedOn
              if (aggregateHasBeenUpdated) {
                // Return error if aggregate has a newer version
                return err(new AggregateHasBeenUpdatedSinceError())
              }

              for (const event of aggregate.pendingEvents) {
                publish(event)
              }

              return ok(null)
            }
          )
      })
      .andThen(unwrapResultOfResult)
      .map(() => null)
  },
})
