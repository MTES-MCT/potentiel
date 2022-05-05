import { ResultAsync } from '@core/utils'
import { OtherError, UnauthorizedError } from '../../shared'

export interface SendResetPasswordEmail {
  (args: { email: string }): ResultAsync<null, UnauthorizedError | OtherError>
}
