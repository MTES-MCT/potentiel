import { ResultAsync } from '@core/utils'
import { AppelOffre } from '@entities'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'

export type getProjectDataForDemanderDelaiPageDTO = {
  id: string
  nomProjet: string
  nomCandidat: string
  communeProjet: string
  regionProjet: string
  departementProjet: string
  periodeId: string
  familleId: string | undefined
  notifiedOn: number
  appelOffreId: string
  numeroGestionnaire?: string
  puissance?: number
  appelOffre?: AppelOffre
  unitePuissance?: string
  newRulesOptIn: boolean
  completionDueOn: number | Date
  dcrNumeroDossier?: string
}

export type GetProjectDataForDemanderDelaiPage = (
  projectId: string
) => ResultAsync<getProjectDataForDemanderDelaiPageDTO, EntityNotFoundError>
