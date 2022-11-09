import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForSignalerDemandeDelaiPage = {
  id: string
  nomProjet: string
  completionDueOn?: number
  hasPendingDemandeDelai: boolean
  nomCandidat: string
  communeProjet: string
  regionProjet: string
  departementProjet: string
  periodeId: string
  familleId: string
  notifiedOn: number
  appelOffreId: string
  cahierDesChargesActuel: string
}

export type GetProjectDataForSignalerDemandeDelaiPage = (filtre: {
  projectId: string
}) => ResultAsync<
  ProjectDataForSignalerDemandeDelaiPage,
  EntityNotFoundError | InfraNotAvailableError
>
