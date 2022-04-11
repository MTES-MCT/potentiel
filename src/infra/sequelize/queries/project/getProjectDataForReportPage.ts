import { err, ok, Result, wrapInfra } from '@core/utils'
import { GetProjectDataForReportPage, ProjectDataForReportPage } from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { Project } = models

export const getProjectDataForReportPage: GetProjectDataForReportPage = ({ projectId }) => {
  return wrapInfra(Project.findByPk(projectId)).andThen(
    (projectRaw: any): Result<ProjectDataForReportPage, EntityNotFoundError> => {
      if (!projectRaw) return err(new EntityNotFoundError())

      const { id, completionDueOn, nomProjet } = projectRaw.get()

      const result = {
        id,
        nomProjet,
        completionDueOn: completionDueOn ? new Date(completionDueOn) : undefined,
      }

      return ok(result)
    }
  )
}
