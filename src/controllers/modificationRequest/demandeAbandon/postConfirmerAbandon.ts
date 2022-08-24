import { confirmerDemandeAbandon, confirmRequest } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../../helpers/asyncHandler'
import { addQueryParams } from '../../../helpers/addQueryParams'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '@modules/shared'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { validateUniqueId } from '../../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers'
import { ConfirmerDemandeAbandonError } from '../../../modules/demandeModification/demandeAbandon/confirmerAbandon/ConfirmerDemandeAbandonError'

v1Router.post(
  routes.CONFIRMER_DEMANDE_ABANDON,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const { demandeAbandonId } = request.body

    if (!validateUniqueId(demandeAbandonId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    return confirmerDemandeAbandon({
      demandeAbandonId,
      confirméPar: request.user,
    }).match(
      () => {
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Votre confirmation a bien été enregistrée.',
            redirectUrl: routes.DEMANDE_PAGE_DETAILS(demandeAbandonId),
            redirectTitle: 'Retourner à la demande',
          })
        )
      },
      (e) => {
        if (e instanceof ConfirmerDemandeAbandonError) {
          return response.redirect(
            addQueryParams(routes.DEMANDE_PAGE_DETAILS(demandeAbandonId), {
              error: e.message,
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
