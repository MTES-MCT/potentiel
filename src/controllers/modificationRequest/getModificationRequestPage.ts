import asyncHandler from 'express-async-handler'
import { getModificationRequestDetails } from '../../config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ModificationRequestDetailsPage } from '../../views/legacy-pages'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'
import { errorResponse, notFoundResponse } from '../helpers'
import { EntityNotFoundError } from '../../modules/shared'
import { validateUniqueId } from '../../helpers/validateUniqueId'

v1Router.get(
  routes.DEMANDE_PAGE_DETAILS(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { modificationRequestId } = request.params

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    const modificationRequestResult = await getModificationRequestDetails(modificationRequestId)

    return modificationRequestResult.match(
      (modificationRequest) => {
        return response.send(ModificationRequestDetailsPage({ request, modificationRequest }))
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
