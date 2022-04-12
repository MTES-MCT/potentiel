import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForSignalerDemandeDelaiPage = {
  id: string
  nomProjet: string
  completionDueOn?: Date
  hasPendingDemandeDelai: boolean
}

export type GetProjectDataForSignalerDemandeDelaiPage = ({
  projectId: string,
}) => ResultAsync<
  ProjectDataForSignalerDemandeDelaiPage,
  EntityNotFoundError | InfraNotAvailableError
>
