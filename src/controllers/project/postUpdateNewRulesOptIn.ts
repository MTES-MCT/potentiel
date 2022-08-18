import { ensureRole, updateNewRulesOptIn } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'
import {
  errorResponse,
  RequestValidationError,
  unauthorizedResponse,
  validateRequestBody,
} from '../helpers'
import { v1Router } from '../v1Router'
import * as yup from 'yup'
import { ok } from '@core/utils'
import { NouveauCahierDesChargesDéjàSouscrit } from '../../modules/project/errors/NouveauCahierDesChargesDéjàSouscrit'

v1Router.post(
  routes.CHANGER_CDC,
  ensureRole('porteur-projet'),
  asyncHandler(async (request, response) => {
    await validateRequestBody(
      request.body,
      yup.object({
        projectId: yup.string().uuid().required(),
      })
    )
      .andThen(({projectId}) => ok({ projectId, optedInBy: request.user }))
      .asyncAndThen(({ projectId, optedInBy }) =>
        updateNewRulesOptIn({
          projectId,
          optedInBy,
        }).map(() => ({ projectId, optedInBy }))
      )
      .match(
        ({ projectId }) =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success:
                "Votre demande de changement de modalités d'instructions a bien été enregistrée.",
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          ),
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          if (
            error instanceof RequestValidationError ||
            error instanceof NouveauCahierDesChargesDéjàSouscrit
          ) {
            return errorResponse({
              request,
              response,
              customMessage:
                'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
            })
          }

          logger.error(error)
          return errorResponse({ request, response })
        }
      )
  })
)
