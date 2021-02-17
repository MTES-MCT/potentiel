import { ResultAsync } from '../../../core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'
import { ProjectDataForProjectPage } from '../dtos'

export type GetProjectDataForProjectPage = ({
  projectId: string,
  user: User,
}) => ResultAsync<ProjectDataForProjectPage, EntityNotFoundError | InfraNotAvailableError>
