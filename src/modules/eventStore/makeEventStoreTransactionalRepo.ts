import { EventStore } from '.'
import { DomainEvent, TransactionalRepository, UniqueEntityID } from '../../core/domain'
import { err, Result, ResultAsync, unwrapResultOfResult } from '../../core/utils'
import {
  EntityNotFoundError,
  EntityAlreadyExistsError,
  HeterogeneousHistoryError,
  InfraNotAvailableError,
} from '../shared'
import { EventStoreAggregate } from './EventStoreAggregate'

export type AggregateFromHistoryFn<T> = (args: {
  events?: DomainEvent[]
  id: UniqueEntityID
}) => Result<T, HeterogeneousHistoryError>

export const makeEventStoreTransactionalRepo = <T extends EventStoreAggregate>(deps: {
  eventStore: EventStore
  makeAggregate: AggregateFromHistoryFn<T>
}): TransactionalRepository<T> => ({
  transaction<K, E>(
    id: UniqueEntityID,
    fn: (aggregate: T) => ResultAsync<K, E> | Result<K, E>,
    opts?: { isNew?: boolean; acceptNew?: boolean }
  ): ResultAsync<
    K,
    | E
    | EntityNotFoundError
    | InfraNotAvailableError
    | HeterogeneousHistoryError
    | EntityAlreadyExistsError
  > {
    return deps.eventStore
      .transaction(({ loadHistory, publish }) => {
        let _aggregate: T

        return loadHistory({ aggregateId: id.toString() })
          .andThen(
            (
              events
            ): Result<
              T,
              EntityNotFoundError | HeterogeneousHistoryError | EntityAlreadyExistsError
            > => {
              if (events.length) {
                if (opts?.isNew) {
                  return err(new EntityAlreadyExistsError())
                }

                return deps.makeAggregate({ events, id })
              }

              if (!opts?.isNew && !opts?.acceptNew) {
                return err(new EntityNotFoundError())
              }

              return deps.makeAggregate({ id })
            }
          )
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
