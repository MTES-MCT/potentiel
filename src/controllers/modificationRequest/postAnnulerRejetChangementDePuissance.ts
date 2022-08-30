import * as yup from 'yup'

import { annulerRejetChangementDePuissance, ensureRole } from '@config'
import { logger } from '@core/utils'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'

import {
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validateRequestBody,
} from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import routes from '../../routes'

const requestBodySchema = yup.object({
  modificationRequestId: yup.string().uuid().required(),
})

v1Router.post(
  routes.ADMIN_ANNULER_CHANGEMENT_DE_PUISSANCE_REJETE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request
        const { modificationRequestId } = body

        return annulerRejetChangementDePuissance({
          user,
          demandeChangementDePuissanceId: modificationRequestId,
        }).map(() => modificationRequestId)
      })
      .match(
        (modificationRequestId) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'La réponse à la demande de changement de puissance a bien été annulée.',
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
