import { ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { InfraNotAvailableError } from '../../shared'

export interface GetUserByEmail {
  (email: string): ResultAsync<User | null, InfraNotAvailableError>
}
