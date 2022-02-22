import { ensureRole, getModificationRequestDetails } from '@config'
import { logger } from '@core/utils'
import { EntityNotFoundError } from '@modules/shared'
import { ModificationRequestPage } from '@views'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import routes from '../../routes'
import { errorResponse, notFoundResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

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
