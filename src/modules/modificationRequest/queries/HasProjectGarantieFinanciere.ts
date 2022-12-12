import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface HasProjectGarantieFinanciere {
  (projetId: string): ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>
}
