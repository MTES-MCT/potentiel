import { ResultAsync } from '@core/utils'
import { User } from '@entities'
import { Permission } from '@modules/authN'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'
import { ProjectDataForProjectPage } from '../dtos'

export const PermissionConsulterProjet: Permission = {
  nom: 'consulter-projet',
  description: 'Consulter un projet',
}

export type GetProjectDataForProjectPage = (args: {
  projectId: string
  user: User
}) => ResultAsync<ProjectDataForProjectPage, EntityNotFoundError | InfraNotAvailableError>
