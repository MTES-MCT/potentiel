import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface GetModificationRequestStatus {
  (modificationRequestId: string): ResultAsync<string, EntityNotFoundError | InfraNotAvailableError>
}
