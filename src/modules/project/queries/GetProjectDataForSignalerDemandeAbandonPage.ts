import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForSignalerDemandeAbandonPage = {
  id: string
  nomProjet: string
  status: string
  nomCandidat: string
  communeProjet: string
  regionProjet: string
  departementProjet: string
  periodeId: string
  familleId: string
  notifiedOn: number
  appelOffreId: string
}

export type GetProjectDataForSignalerDemandeAbandonPage = ({
  projectId: string,
}) => ResultAsync<
  ProjectDataForSignalerDemandeAbandonPage,
  EntityNotFoundError | InfraNotAvailableError
>
