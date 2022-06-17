import { ensureRole, projectRepo } from '@config'
import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

v1Router.get(
  '/admin/corriger-projet-elimine-puis-classe',
  ensureRole('admin'),
  asyncHandler(async (request, response) => {
    const projectId = 'c599d37b-641e-49b2-a21f-2c1bb4261476'
    try {
      const res = await projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
        return project.corrigerProjetSansDatesDues()
      })

      if (res.isErr()) {
        throw res.error
      }
    } catch (e) {
      logger.error(e)
      response.send('Une erreur est survenue')
    }
    response.redirect(
      addQueryParams(routes.PROJECT_DETAILS(projectId), {
        success: 'Le projet a bien été corrigé.',
      })
    )
  })
)
