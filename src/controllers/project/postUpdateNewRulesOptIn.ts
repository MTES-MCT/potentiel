import asyncHandler from 'express-async-handler'
import { ensureRole, updateNewRulesOptIn } from '@config'
import { logger } from '@core/utils'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.CHANGER_CDC,
  ensureRole('porteur-projet'),
  asyncHandler(async (request, response) => {
    const {
      body: { projectId },
      user: optedInBy,
    } = request

    if (!validateUniqueId(projectId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      })
    }

    const result = updateNewRulesOptIn({
      projectId,
      optedInBy,
    })

    await result.match(
      () => {
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success:
              "Votre demande de changement de modalités d'instructions a bien été enregistrée.",
            redirectUrl: routes.PROJECT_DETAILS(projectId),
            redirectTitle: 'Retourner à la page projet',
          })
        )
      },
      (error) => {
        if (error instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response })
        }

        logger.error(error)
        return errorResponse({ request, response })
      }
    )
  })
)
