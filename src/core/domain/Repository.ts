import { ResultAsync } from '../utils'
import { DomainError } from './DomainError'

export type Repository<T> = {
  save: (aggregate: T) => ResultAsync<null, DomainError>
  load: (id: string) => ResultAsync<T | null, DomainError>
}
