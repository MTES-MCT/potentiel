import { ensureRole, updateNewRulesOptIn } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import { addQueryParams } from '../../helpers/addQueryParams'

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
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success:
              "Votre demande de changement de modalités d'instructions a bien été enregistrée.",
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
