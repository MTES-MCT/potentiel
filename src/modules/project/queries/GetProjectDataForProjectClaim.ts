import { ProjectDataForProjectClaim } from '..'
import { ResultAsync } from '../../../core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type GetProjectDataForProjectClaim = (
  projectId: string
) => ResultAsync<ProjectDataForProjectClaim, EntityNotFoundError | InfraNotAvailableError>
