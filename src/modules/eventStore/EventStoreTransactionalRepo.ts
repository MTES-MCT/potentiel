import { EventStore, StoredEvent } from '.'
import { TransactionalRepository, UniqueEntityID } from '../../core/domain'
import { Result, ResultAsync } from '../../core/utils'
import { EntityNotFoundError, HeterogeneousHistoryError, InfraNotAvailableError } from '../shared'

type AggregateFromHistoryFn<T> = (
  events: StoredEvent[]
) => Result<T, EntityNotFoundError | HeterogeneousHistoryError>

interface HasPendingEvents {
  pendingEvents: StoredEvent[]
}

export class EventStoreTransactionalRepo<T extends HasPendingEvents>
  implements TransactionalRepository<T> {
  constructor(private eventStore: EventStore, private makeFn: AggregateFromHistoryFn<T>) {}

  transaction<K, E>(
    id: UniqueEntityID,
    fn: (aggregate: T) => ResultAsync<K, E> | Result<K, E>
  ): ResultAsync<K, E | EntityNotFoundError | InfraNotAvailableError | HeterogeneousHistoryError> {
    return this.eventStore
      .transaction(({ loadHistory, publish }) => {
        let _aggregate: T

        return loadHistory({ aggregateId: id.toString() })
          .andThen(this.makeFn)
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
      .andThen((item) => item)
  }
}
