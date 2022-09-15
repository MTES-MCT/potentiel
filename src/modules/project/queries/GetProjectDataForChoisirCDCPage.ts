import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'
import { ProjectAppelOffre } from '@entities'

export type ProjectDataForChoisirCDCPage = {
  id: string
  appelOffreId: string
  periodeId: string
  familleId: string
  appelOffre: ProjectAppelOffre
  nouvellesRèglesDInstructionChoisies: boolean
  isClasse: boolean
}

export type GetProjectDataForChoisirCDCPage = (
  projectId: string
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>
