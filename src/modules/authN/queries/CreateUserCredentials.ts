import { ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { OtherError } from '../../shared'

export interface CreateUserCredentials {
  (args: { role: User['role']; email: string; fullName?: string }): ResultAsync<string, OtherError>
}
