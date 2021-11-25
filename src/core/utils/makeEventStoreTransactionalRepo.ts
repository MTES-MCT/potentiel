import {
  DomainEvent,
  TransactionalRepository,
  UniqueEntityID,
  EventStore,
  EventStoreAggregate,
} from '..//domain'
import { err, Result, ResultAsync, unwrapResultOfResult } from '..//utils'
import {
  EntityNotFoundError,
  EntityAlreadyExistsError,
  HeterogeneousHistoryError,
  InfraNotAvailableError,
} from '../../modules/shared'
import { okAsync } from 'neverthrow'

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
    let result: K
    return deps.eventStore
      .transaction(id, (events) => {
        let _aggregate: T

        return okAsync<null, never>(null)
          .andThen(
            (): Result<
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
            result = fnResult
            // Save the effects one the aggregate by publishing pendingEvents
            return _aggregate.pendingEvents
          })
      })
      .map(() => result)
  },
})
