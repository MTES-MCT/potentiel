import { err, ok, Result, wrapInfra } from '@core/utils'
import {
  GetProjectDataForDemanderDelaiPage,
  ProjectDataForDemanderDelaiPage,
} from '@modules/demandeModification/demandeDélai'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'

import models from '../../models'

const { Project } = models

export const getProjectDataForDemanderDelaiPage: GetProjectDataForDemanderDelaiPage = (projectId) =>
  wrapInfra(Project.findByPk(projectId)).andThen(
    (
      projectRaw: any
    ): Result<ProjectDataForDemanderDelaiPage, EntityNotFoundError | InfraNotAvailableError> => {
      if (!projectRaw) return err(new EntityNotFoundError())

      console.log(projectRaw)

      const {
        id,
        completionDueOn,
        nomProjet,
        nomCandidat,
        communeProjet,
        regionProjet,
        departementProjet,
        notifiedOn,
        periodeId,
        familleId,
        appelOffreId,
      } = projectRaw.get()

      const project = {
        id,
        nomProjet,
        ...(completionDueOn > 0 && { completionDueOn }),
        nomCandidat,
        communeProjet,
        regionProjet,
        departementProjet,
        notifiedOn,
        periodeId,
        familleId,
        appelOffreId,
      }

      return ok(project)
    }
  )
