import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForSignalerDemandeAbandonPage = {
  id: string
  status: 'non-notifié' | 'abandonné' | 'lauréat' | 'éliminé'
  nomProjet: string
  nomCandidat: string
  communeProjet: string
  regionProjet: string
  departementProjet: string
  periodeId: string
  familleId: string
  notifiedOn: number
  appelOffreId: string
  puissance: number
  unitePuissance: string
}

export type GetProjectDataForSignalerDemandeAbandonPage = (filtre: {
  projectId: string
}) => ResultAsync<
  ProjectDataForSignalerDemandeAbandonPage,
  EntityNotFoundError | InfraNotAvailableError
>
