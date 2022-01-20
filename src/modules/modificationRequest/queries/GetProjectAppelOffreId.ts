import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface GetProjectAppelOffreId {
  (projectId: string): ResultAsync<string, EntityNotFoundError | InfraNotAvailableError>
}
