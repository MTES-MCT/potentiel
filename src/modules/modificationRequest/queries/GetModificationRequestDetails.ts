import { ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { AdminModificationRequestDTO } from '../dtos'

export interface GetModificationRequestDetails {
  (modificationRequestId: string): ResultAsync<
    AdminModificationRequestDTO,
    EntityNotFoundError | InfraNotAvailableError
  >
}
