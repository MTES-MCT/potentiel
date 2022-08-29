import * as yup from 'yup'

import { annulerRejetRecours, ensureRole } from '@config'
import { logger } from '@core/utils'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { validateRequestBodyForErrorArray } from '../helpers'
import { v1Router } from '../v1Router'

const requestBodySchema = yup.object({
  modificationRequestId: yup.string().uuid().required(),
})

v1Router.post(
  routes.ADMIN_ANNULER_RECOURS_REJETE(),
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request
        const { modificationRequestId } = body

        return annulerRejetRecours({
          user,
          demandeRecoursId: modificationRequestId,
        }).map(() => ({ modificationRequestId }))
      })
      .match(
        ({ modificationRequestId }) => {
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
