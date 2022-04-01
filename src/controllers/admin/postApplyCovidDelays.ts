import { ensureRole, projectRepo } from '@config'
import { UniqueEntityID } from '../../core/domain'
import { errAsync, logger, okAsync, ResultAsync } from '../../core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import models from '../../infra/sequelize/models'
import { InfraNotAvailableError } from '../../modules/shared'
import { ok } from 'assert'
import { errorResponse } from '../helpers'
import { Op } from 'sequelize'

// Ce point d'entrée est destiné à n'être appelé qu'une seule fois - à supprimer
const { Project } = models

v1Router.get(
  '/admin/apply-covid-delays',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const result = await getQualifiedProjects()

    if (result.isErr()) {
      return errorResponse({ response, request })
    }

    const projectIds = result.value
  })
)

function getQualifiedProjects() {
  return ResultAsync.fromPromise(
    Project.findAll({
      attributes: ['id'],
      where: {
        notifiedOn: {
          [Op.lte]: new Date('2020-06-23').getTime(),
        },
        puissanceInitiale: {
          [Op.lt]: 200,
        },
        details: {
          'Délai automatique Covid': {
            [Op.not]: 'x',
          },
        },
      },
    }),
    () => new InfraNotAvailableError()
  ).map((projects: any) => projects.map((project) => project.id))
}
