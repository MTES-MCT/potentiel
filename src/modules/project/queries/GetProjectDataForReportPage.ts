import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared'

export type ProjectDataForReportPage = {
  id: string
  nomProjet: string
  completionDueOn?: Date
}

export type GetProjectDataForReportPage = ({
  projectId: string,
}) => ResultAsync<ProjectDataForReportPage, EntityNotFoundError | InfraNotAvailableError>
