import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { errAsync, ok, okAsync, Result, wrapInfra } from '@core/utils'
import {
  GetProjectDataForSignalerDemandeRecoursPage,
  ProjectDataForSignalerDemandeRecoursPage,
} from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'
import models from '../../models'

const { Project } = models

export const getProjectDataForSignalerDemandeRecoursPage: GetProjectDataForSignalerDemandeRecoursPage =
  ({ projectId }) => {
    return wrapInfra(Project.findByPk(projectId))
      .andThen((projet) => {
        if (!projet) {
          return errAsync(new EntityNotFoundError())
        }

        const { appelOffreId, periodeId, familleId } = projet
        const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

        if (!appelOffre) {
          return errAsync(new EntityNotFoundError())
        }

        return okAsync({ projet, appelOffre })
      })
      .andThen(
        ({
          projet,
          appelOffre,
        }): Result<ProjectDataForSignalerDemandeRecoursPage, EntityNotFoundError> => {
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
            puissance,
          } = projet

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
            periodeId,
            familleId,
            appelOffreId,
            puissance,
            unitePuissance: appelOffre.unitePuissance,
          }

          return ok(project)
        }
      )
  }
