import { ensureRole, projectRepo } from '@config'
import { UniqueEntityID } from '../../core/domain'
import { errAsync, logger, okAsync, ResultAsync } from '../../core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import models from '../../infra/sequelize/models'
import { InfraNotAvailableError } from '../../modules/shared'
import { ok } from 'assert'
import { errorResponse } from '../helpers'

// Ce point d'entrée est destiné à n'être appelé qu'une seule fois - à supprimer
const { Project } = models

v1Router.get(
  '/admin/cancel-GFDueDate-PPE2',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const result = await getProjectToFix()

    if (result.isErr()) {
      return errorResponse({ response, request })
    }

    const projectIds = result.value

    try {
      for (const projectId of projectIds) {
        const res = await projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
          return project.cancelGFDueDateSet()
        })
        if (res.isErr()) {
          throw res.error
        }
      }
    } catch (e) {
      logger.error(e)
      return errorResponse({ response, request })
    }

    response.send('Les projets ont bien été corrigés')
  })
)

function getProjectToFix() {
  return ResultAsync.fromPromise(
    Project.findAll({
      attributes: ['id'],
      where: {
        appelOffreId: ['PPE2 - Bâtiment', 'PPE2 - Eolien', 'PPE2 - Autoconsommation métropole'],
      },
    }),
    () => new InfraNotAvailableError()
  ).map((projects: any) => projects.map((project) => project.id))
}
