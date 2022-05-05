import { err, ok, Result, wrapInfra } from '@core/utils'
import {
  GetProjectDataForSignalerDemandeRecoursPage,
  ProjectDataForSignalerDemandeRecoursPage,
} from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { Project } = models

export const getProjectDataForSignalerDemandeRecoursPage: GetProjectDataForSignalerDemandeRecoursPage =
  ({ projectId }) => {
    return wrapInfra(Project.findByPk(projectId)).andThen(
      (projectRaw: any): Result<ProjectDataForSignalerDemandeRecoursPage, EntityNotFoundError> => {
        if (!projectRaw) return err(new EntityNotFoundError())

        const {
          id,
          nomProjet,
          classe,
          nomCandidat,
          communeProjet,
          regionProjet,
          departementProjet,
          notifiedOn,
          abandonedOn,
          periodeId,
          familleId,
          appelOffreId,
        } = projectRaw.get()

        const status = !notifiedOn
          ? 'non-notifié'
          : abandonedOn
          ? 'abandonné'
          : classe === 'Classé'
          ? 'lauréat'
          : 'éliminé'

        const project: ProjectDataForSignalerDemandeRecoursPage = {
          id,
          nomProjet,
          status,
          nomCandidat,
          communeProjet,
          regionProjet,
          departementProjet,
          notifiedOn,
          ...(abandonedOn > 0 && { abandonedOn }),
          periodeId,
          familleId,
          appelOffreId,
        }

        return ok(project)
      }
    )
  }
