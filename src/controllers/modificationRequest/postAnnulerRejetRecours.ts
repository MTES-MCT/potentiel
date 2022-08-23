import { annulerRejetRecours, ensureRole } from '@config'
import { logger } from '@core/utils'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.ADMIN_ANNULER_RECOURS_REJETE(),
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    const {
      body: { modificationRequestId },
      user,
    } = request
    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    return annulerRejetRecours({
      user,
      demandeRecoursId: modificationRequestId,
    }).match(
      () => {
        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La réponse à la demande de recours a bien été annulée.',
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
