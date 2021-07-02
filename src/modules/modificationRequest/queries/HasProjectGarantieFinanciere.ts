import { ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface HasProjectGarantieFinanciere {
  (projectId: string): ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>
}
