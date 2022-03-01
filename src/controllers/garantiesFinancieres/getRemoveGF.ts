import { logger } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { removeGF } from '@config/useCases.config'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import asyncHandler from '../helpers/asyncHandler'
import { asLiteral } from '../../helpers/asLiteral'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { UnauthorizedError } from '@modules/shared'

v1Router.get(
  routes.REMOVE_GARANTIES_FINANCIERES(),
  ensureRole(['admin', 'dgec', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { user } = request
    const { projectId, type } = request.params

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    if (type !== 'garanties-financieres') {
      return errorResponse({ request, response })
    }

    ;(
      await removeGF({
        removedBy: user,
        projectId,
        type: asLiteral(type),
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: "Le dépôt de l'attestation de garanties financières a été annulé avec succès.",
          })
        ),
      (e) => {
        if (e instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response })
        }

        logger.error(e)
        return errorResponse({ request, response })
      }
    )
  })
)
