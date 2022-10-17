import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForSignalerDemandeAbandonPage = {
  id: string
  nomProjet: string
  status: 'non-notifié' | 'abandonné' | 'lauréat' | 'éliminé'
  nomCandidat: string
  communeProjet: string
  regionProjet: string
  departementProjet: string
  periodeId: string
  familleId: string
  notifiedOn: number
  abandonedOn?: number
  appelOffreId: string
}

export type GetProjectDataForSignalerDemandeAbandonPage = (filtre: {
  projectId: string
}) => ResultAsync<
  ProjectDataForSignalerDemandeAbandonPage,
  EntityNotFoundError | InfraNotAvailableError
>
