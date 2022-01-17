import { ResultAsync } from '@core/utils'
import { OtherError } from '../../shared'

export interface GetUserName {
  (id): ResultAsync<string, OtherError>
}
