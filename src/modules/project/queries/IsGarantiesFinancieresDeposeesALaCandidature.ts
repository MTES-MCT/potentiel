import { ResultAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'

export type IsGarantiesFinancieresDeposeesALaCandidature = (
  projectId: string
) => ResultAsync<boolean, EntityNotFoundError | InfraNotAvailableError>
