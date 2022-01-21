import { cancelModificationRequest, ensureRole } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.ANNULER_DEMANDE_ACTION,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const { modificationRequestId } = request.body

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    return cancelModificationRequest({
      modificationRequestId,
      cancelledBy: request.user,
    }).match(
      () => {
        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Votre demande a bien été annulée.',
            redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            redirectTitle: 'Retourner à la demande',
          })
        )
      },
      (e) => {
        if (e instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
        } else if (e instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response })
        }

        logger.error(e)

        return errorResponse({ request, response })
      }
    )
  })
)
