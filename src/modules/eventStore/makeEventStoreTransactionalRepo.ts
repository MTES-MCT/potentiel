import { EventStore, StoredEvent } from '.'
import { TransactionalRepository, UniqueEntityID } from '../../core/domain'
import { Result, ResultAsync, unwrapResultOfResult } from '../../core/utils'
import { EntityNotFoundError, HeterogeneousHistoryError, InfraNotAvailableError } from '../shared'
import { EventStoreAggregate } from './EventStoreAggregate'

type AggregateFromHistoryFn<T> = (args: {
  events: StoredEvent[]
  id: UniqueEntityID
}) => Result<T, EntityNotFoundError | HeterogeneousHistoryError>

export const makeEventStoreTransactionalRepo = <T extends EventStoreAggregate>(deps: {
  eventStore: EventStore
  makeAggregate: AggregateFromHistoryFn<T>
}): TransactionalRepository<T> => ({
  transaction<K, E>(
    id: UniqueEntityID,
    fn: (aggregate: T) => ResultAsync<K, E> | Result<K, E>
  ): ResultAsync<K, E | EntityNotFoundError | InfraNotAvailableError | HeterogeneousHistoryError> {
    return deps.eventStore
      .transaction(({ loadHistory, publish }) => {
        let _aggregate: T

        return loadHistory({ aggregateId: id.toString() })
          .andThen((events) => deps.makeAggregate({ events, id }))
          .andThen((aggregate) => {
            _aggregate = aggregate
            return fn(aggregate)
          })
          .map((fnResult) => {
            // Save the effects one the aggregate by publishing pendingEvents
            _aggregate.pendingEvents.forEach(publish)
            return fnResult
          })
      })
      .andThen(unwrapResultOfResult)
  },
})
