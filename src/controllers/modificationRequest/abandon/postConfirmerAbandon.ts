import * as yup from 'yup'

import { confirmerDemandeAbandon, ensureRole } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../../helpers/asyncHandler'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'
import routes from '@routes'
import { v1Router } from '../../v1Router'
import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validateRequestBody,
} from '../../helpers'
import { ConfirmerDemandeAbandonError } from '../../../modules/demandeModification/demandeAbandon/confirmerAbandon/ConfirmerDemandeAbandonError'

const requestBodySchema = yup.object({
  demandeAbandonId: yup.string().uuid().required(),
})

v1Router.post(
  routes.CONFIRMER_DEMANDE_ABANDON,
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request
        const { demandeAbandonId } = body

        return confirmerDemandeAbandon({
          demandeAbandonId,
          confirméPar: user,
        }).map(() => demandeAbandonId)
      })
      .match(
        (demandeAbandonId) => {
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
              addQueryParams(routes.DEMANDE_PAGE_DETAILS(request.body.demandeAbandonId), {
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
