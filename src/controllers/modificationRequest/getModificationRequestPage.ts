import { ensureRole, getModificationRequestDetails } from '@config'
import { logger } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'
import { ModificationRequestPage } from '@views'
import routes from '@routes'
import { shouldUserAccessProject } from '@config/useCases.config'
import { getModificationRequestAuthority } from '@infra/sequelize/queries'

import models from '../../infra/sequelize/models'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import { validateUniqueId } from '../../helpers/validateUniqueId'

v1Router.get(
  routes.DEMANDE_PAGE_DETAILS(),
  ensureRole(['admin', 'dgec-validateur', 'dreal', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { modificationRequestId } = request.params
    const { user } = request

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    const projectId = await _getProjectId(modificationRequestId, models)
    if (!projectId) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    const userHasRightsToProject = await shouldUserAccessProject.check({
      user,
      projectId,
    })
    if (!userHasRightsToProject) {
      return unauthorizedResponse({
        request,
        response,
        customMessage: `Votre compte ne vous permet pas d'accéder à cette page.`,
      })
    }

    if (user.role === 'dreal') {
      const authority = await getModificationRequestAuthority(modificationRequestId)

      if (authority && authority !== user.role) {
        return unauthorizedResponse({ request, response })
      }
    }

    const modificationRequestResult = await getModificationRequestDetails(modificationRequestId)

    return modificationRequestResult.match(
      (modificationRequest) => {
        return response.send(ModificationRequestPage({ request, modificationRequest }))
      },
      (e) => {
        if (e instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
        }

        logger.error(e)
        return errorResponse({ request, response })
      }
    )
  })
)

async function _getProjectId(modificationRequestId, models) {
  const { ModificationRequest } = models

  const rawModificationRequest = await ModificationRequest.findOne({
    where: {
      id: modificationRequestId,
    },
    attributes: ['projectId'],
  })

  return rawModificationRequest.projectId
}
