import { ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { OtherError, UnauthorizedError } from '../../shared'

export interface CreateUserCredentials {
  (args: { role: User['role']; email: string; fullName?: string }): ResultAsync<
    null,
    UnauthorizedError | OtherError
  >
}
