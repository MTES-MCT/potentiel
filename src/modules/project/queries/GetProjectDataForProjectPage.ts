import { ResultAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'
import { ProjectDataForProjectPage } from '../dtos'

export type GetProjectDataForProjectPage = (args: {
  projectId: string
  user: User
}) => ResultAsync<ProjectDataForProjectPage, EntityNotFoundError | InfraNotAvailableError>
