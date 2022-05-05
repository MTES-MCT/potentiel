import { logger } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { withdrawGF } from '@config/useCases.config'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import asyncHandler from '../helpers/asyncHandler'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { UnauthorizedError } from '@modules/shared'

v1Router.get(
  routes.WITHDRAW_GARANTIES_FINANCIERES(),
  ensureRole(['porteur-projet', 'dreal']),
  asyncHandler(async (request, response) => {
    const { user } = request
    const { projectId } = request.params

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    ;(
      await withdrawGF({
        removedBy: user,
        projectId,
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
