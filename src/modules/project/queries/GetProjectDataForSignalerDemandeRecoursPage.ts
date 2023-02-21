import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForSignalerDemandeRecoursPage = {
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
  appelOffreId: string
  puissance: number
  unitePuissance: string
}

export type GetProjectDataForSignalerDemandeRecoursPage = (filtre: {
  projectId: string
}) => ResultAsync<
  ProjectDataForSignalerDemandeRecoursPage,
  EntityNotFoundError | InfraNotAvailableError
>
