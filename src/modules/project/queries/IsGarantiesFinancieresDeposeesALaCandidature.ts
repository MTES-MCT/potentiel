import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export interface IsGarantiesFinancieresDeposeesALaCandidature {
  (projectId: string): ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>
}
