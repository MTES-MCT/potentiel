import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'
import { ProjectAppelOffre } from '@entities'

export type ProjectDataForChoisirCDCPage = {
  id: string
  appelOffre: ProjectAppelOffre
  cahierDesChargesActuel: string
  identifiantGestionnaireRéseau: string
}

export type GetProjectDataForChoisirCDCPage = (
  projectId: string
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>
