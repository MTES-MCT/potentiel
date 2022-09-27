import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'
import { ProjectAppelOffre, CahierDesChargesId } from '@entities'

export type ProjectDataForChoisirCDCPage = {
  id: string
  appelOffre: ProjectAppelOffre
  cahierDesChargesActuel: CahierDesChargesId
  identifiantGestionnaireRéseau: string
}

export type GetProjectDataForChoisirCDCPage = (
  projectId: string
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>
