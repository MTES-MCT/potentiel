import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface IsProjectParticipatif {
  (projectId: string): ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>
}
