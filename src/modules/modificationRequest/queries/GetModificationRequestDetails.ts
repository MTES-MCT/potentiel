import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { ModificationRequestPageDTO } from '../dtos'

export interface GetModificationRequestDetails {
  (modificationRequestId: string): ResultAsync<
    ModificationRequestPageDTO,
    EntityNotFoundError | InfraNotAvailableError
  >
}
