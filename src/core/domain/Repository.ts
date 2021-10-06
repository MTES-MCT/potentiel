import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  HeterogeneousHistoryError,
  InfraNotAvailableError,
} from '../../modules/shared'
import { Result, ResultAsync } from '../utils'
import { UniqueEntityID } from './UniqueEntityID'

export type Repository<T> = {
  save: (
    aggregate: T
  ) => ResultAsync<null, InfraNotAvailableError | AggregateHasBeenUpdatedSinceError>
  load: (id: UniqueEntityID) => ResultAsync<T, EntityNotFoundError | InfraNotAvailableError>
}

export type TransactionalRepository<T> = {
  transaction: <K, E>(
    id: UniqueEntityID,
    fn: (aggregate: T) => ResultAsync<K, E> | Result<K, E>,
    opts?: { isNew?: boolean; acceptNew?: boolean }
  ) => ResultAsync<K, E | EntityNotFoundError | InfraNotAvailableError | HeterogeneousHistoryError>
}
