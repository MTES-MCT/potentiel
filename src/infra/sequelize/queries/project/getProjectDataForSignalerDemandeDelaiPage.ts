import { err, ok, Result, ResultAsync, wrapInfra } from '@core/utils'
import {
  GetProjectDataForSignalerDemandeDelaiPage,
  ProjectDataForSignalerDemandeDelaiPage,
} from '@modules/project'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import { Op } from 'sequelize'
import models from '../../models'

const { Project, ModificationRequest } = models

export const getProjectDataForSignalerDemandeDelaiPage: GetProjectDataForSignalerDemandeDelaiPage =
  ({ projectId }) => {
    return wrapInfra(Project.findByPk(projectId))
      .andThen(
        (
          projectRaw: any
        ): Result<
          Omit<ProjectDataForSignalerDemandeDelaiPage, 'hasPendingDemandeDelai'>,
          EntityNotFoundError
        > => {
          if (!projectRaw) return err(new EntityNotFoundError())

          const { id, completionDueOn, nomProjet } = projectRaw.get()

          const project = {
            id,
            nomProjet,
            completionDueOn: completionDueOn ? new Date(completionDueOn) : undefined,
          }

          return ok(project)
        }
      )
      .andThen((project) =>
        hasPendingDemandeDelai(project.id).andThen((count) =>
          ok({
            ...project,
            hasPendingDemandeDelai: count > 0 ? true : false,
          })
        )
      )
  }

const hasPendingDemandeDelai: (projectId: string) => ResultAsync<number, InfraNotAvailableError> = (
  projectId
) =>
  wrapInfra(
    ModificationRequest.findAndCountAll({
      where: {
        projectId,
        type: 'delai',
        status: { [Op.notIn]: ['acceptée', 'rejetée', 'annulée'] },
      },
    })
  ).andThen(({ count }) => ok(count))
