import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForSignalerDemandeDelaiPage = {
  id: string
  nomProjet: string
  completionDueOn?: Date
  hasPendingDemandeDelai: boolean
  nomCandidat: string
  communeProjet: string
  regionProjet: string
  departementProjet: string
  periodeId: string
  familleId: string
  notifiedOn: number
  appelOffreId: string
}

export type GetProjectDataForSignalerDemandeDelaiPage = ({
  projectId: string,
}) => ResultAsync<
  ProjectDataForSignalerDemandeDelaiPage,
  EntityNotFoundError | InfraNotAvailableError
>
