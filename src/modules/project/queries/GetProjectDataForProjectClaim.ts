import { ResultAsync } from '@core/utils'
import { ProjectDataForProjectClaim } from '../../projectClaim'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type GetProjectDataForProjectClaim = (
  projectId: string
) => ResultAsync<ProjectDataForProjectClaim, EntityNotFoundError | InfraNotAvailableError>
