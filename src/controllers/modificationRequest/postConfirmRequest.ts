import asyncHandler from 'express-async-handler'
import { confirmRequest } from '../../config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '../../modules/shared'
import routes from '../../routes'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'

v1Router.post(
  routes.CONFIRMER_DEMANDE_ACTION,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const { modificationRequestId, versionDate } = request.body

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    return confirmRequest({
      modificationRequestId,
      versionDate: new Date(Number(versionDate)),
      confirmedBy: request.user,
    }).match(
      () => {
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Votre demande a bien été confirmée.',
            redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
            redirectTitle: 'Retourner à la demande',
          })
        )
      },
      (e) => {
        if (e instanceof AggregateHasBeenUpdatedSinceError) {
          return response.redirect(
            addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
              error: `Votre confirmation n'a pas pu être prise en compte parce que la demande a été mise à jour entre temps. Merci de réessayer.`,
            })
          )
        } else if (e instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response })
        } else if (e instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
        }

        logger.error(e)

        return errorResponse({ request, response })
      }
    )
  })
)
