import { ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { ModificationRequestDataForResponseTemplateDTO } from '../dtos'

export interface GetModificationRequestDateForResponseTemplate {
  (modificationRequestId: string, user: User, dgecEmail: string): ResultAsync<
    ModificationRequestDataForResponseTemplateDTO,
    EntityNotFoundError | InfraNotAvailableError
  >
}
