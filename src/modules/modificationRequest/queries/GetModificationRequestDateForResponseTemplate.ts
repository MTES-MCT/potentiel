import { ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { ModificationRequestDateForResponseTemplateDTO } from '../dtos'

export interface GetModificationRequestDateForResponseTemplate {
  (modificationRequestId: string, user: User): ResultAsync<
    ModificationRequestDateForResponseTemplateDTO,
    EntityNotFoundError | InfraNotAvailableError
  >
}
