import * as yup from 'yup'

import { annulerDemandeAnnulationAbandon, ensureRole } from '@config'
import { logger } from '@core/utils'
import safeAsyncHandler from '../../helpers/safeAsyncHandler'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'
import routes from '../../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers'
import { v1Router } from '../../v1Router'
import { addQueryParams } from 'src/helpers/addQueryParams'

const schema = yup.object({
  body: yup.object({
    demandeId: yup.string().uuid().required(),
  }),
})

v1Router.post(
  routes.POST_ANNULER_DEMANDE_ANNULATION_ABANDON,
  ensureRole(['porteur-projet']),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.USER_LIST_REQUESTS, {
            ...error.errors,
          })
        ),
    },
    async (request, response) => {
      const { user } = request
      const { demandeId } = request.body

      return annulerDemandeAnnulationAbandon({
        user,
        demandeId,
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Votre demande a bien été annulée.`,
              redirectUrl: routes.DEMANDE_PAGE_DETAILS(demandeId),
              redirectTitle: 'Retourner à la page de la demande',
            })
          )
        },
        (error) => {
          if (error instanceof EntityNotFoundError) {
            return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
          } else if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          logger.error(error)
          return errorResponse({
            request,
            response,
            customMessage: `Il y a eu une erreur lors de l'annulation de votre demande. Merci de recommencer.`,
          })
        }
      )
    }
  )
)
