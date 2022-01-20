import { ResultAsync } from '@core/utils'
import { OtherError, UnauthorizedError } from '../../shared'
import { UserRole } from '../../users'

export interface CreateUserCredentials {
  (args: { role: UserRole; email: string; fullName?: string }): ResultAsync<
    null,
    UnauthorizedError | OtherError
  >
}
