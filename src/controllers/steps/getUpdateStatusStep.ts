import asyncHandler from 'express-async-handler'
import { ensureRole } from '../../config'
import { updateStepStatus } from '../../config/useCases.config'
import { logger } from '@core/utils'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.UPDATE_PROJECT_STEP_STATUS(),
  ensureRole(['dreal']),
  asyncHandler(async (request, response) => {
    const redirectUrl = routes.ADMIN_GARANTIES_FINANCIERES

    const { user } = request
    const { projectId, newStatus, projectStepId } = request.params

    if (!validateUniqueId(projectId) || !validateUniqueId(projectStepId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    if (!['à traiter', 'validé'].includes(newStatus)) {
      return errorResponse({ request, response, customStatus: 400 })
    }

    ;(
      await updateStepStatus({
        updatedBy: user,
        projectId,
        projectStepId,
        newStatus: newStatus as 'à traiter' | 'validé',
      })
    ).match(
      () =>
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: `Cette étape projet est bien considérée comme ${newStatus}.`,
            redirectUrl,
            redirectTitle: 'Retourner à la liste des garantes financières',
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
