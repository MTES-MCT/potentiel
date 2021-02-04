import { ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface GetProjectIdForAdmissionKey {
  (projectAdmissionKeyId: string): ResultAsync<string, InfraNotAvailableError | EntityNotFoundError>
}
