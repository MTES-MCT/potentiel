import { ensureRole, projectRepo } from '@config'
import { Op } from 'sequelize'
import { UniqueEntityID } from '../../core/domain'
import { logger, ResultAsync } from '../../core/utils'
import models from '../../infra/sequelize/models'
import { InfraNotAvailableError } from '../../modules/shared'
import { errorResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

// Ce point d'entrée est destiné à n'être appelé qu'une seule fois - à supprimer
const { Project } = models

v1Router.get(
  '/admin/corriger-ppe2-batiment-1',
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
          return project.removeUnexpectedGFDueDateforPPE2Project()
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
        appelOffreId: 'PPE2 - Bâtiment',
        periodeId: '1',
        classe: 'Classé',
        garantiesFinancieresDueOn: {
          [Op.gt]: 0,
        },
      },
    }),
    () => new InfraNotAvailableError()
  ).map((projects: any) => projects.map((project) => project.id))
}
