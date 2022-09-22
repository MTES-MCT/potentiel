import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'
import { ProjectAppelOffre } from '@entities'

export type ProjectDataForChoisirCDCPage = {
  id: string
  appelOffre: ProjectAppelOffre
  cahierDesChargesActuel: 'initial' | '30/07/2021' | '30/08/2022' | '30/08/2022-alternatif'
}

export type GetProjectDataForChoisirCDCPage = (
  projectId: string
) => ResultAsync<ProjectDataForChoisirCDCPage, EntityNotFoundError | InfraNotAvailableError>
