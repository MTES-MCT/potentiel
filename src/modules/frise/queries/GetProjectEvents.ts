import { ProjectEventListDTO } from '..'
import { ResultAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'

export type GetProjectEvents = (args: {
  projectId: string
  user: User
}) => ResultAsync<ProjectEventListDTO, UnauthorizedError | InfraNotAvailableError>
