import * as yup from 'yup'

import { annulerDemandeAbandon, ensureRole } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../../helpers/asyncHandler'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'
import routes from '../../../routes'
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validateRequestBody,
} from '../../helpers'
import { v1Router } from '../../v1Router'

const requestBodySchema = yup.object({
  modificationRequestId: yup.string().uuid().required(),
})

v1Router.post(
  routes.ANNULER_DEMANDE_ABANDON_ACTION,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request
        const { modificationRequestId } = body

        return annulerDemandeAbandon({
          user,
          demandeAbandonId: modificationRequestId,
        }).map(() => modificationRequestId)
      })
      .match(
        (modificationRequestId) =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre demande a bien été annulée.',
              redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
              redirectTitle: 'Retourner à la demande',
            })
          ),
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
