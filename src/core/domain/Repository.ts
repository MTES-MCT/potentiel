import {
  EntityNotFoundError,
  InfraNotAvailableError,
} from '../../modules/shared'
import { ResultAsync } from '../utils'
import { DomainError } from './DomainError'
import { UniqueEntityID } from './UniqueEntityID'

export type Repository<T> = {
  save: (aggregate: T) => ResultAsync<null, InfraNotAvailableError>
  load: (
    id: UniqueEntityID
  ) => ResultAsync<T, EntityNotFoundError | InfraNotAvailableError>
}
