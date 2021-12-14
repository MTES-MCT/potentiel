import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { updateStepStatus } from '../../config/useCases.config'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.UPDATE_PROJECT_STEP_STATUS(),
  ensureRole(['dreal']),
  asyncHandler(async (request, response) => {
    const redirectUrl = routes.ADMIN_GARANTIES_FINANCIERES

    const { user } = request
    const { projectId, newStatus, projectStepId } = request.params

    if (!projectId || !projectStepId || !['à traiter', 'validé'].includes(newStatus)) {
      return response.status(400).send('Requête erronnée')
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
      (e: Error) => {
        logger.error(e)
        return response.redirect(
          addQueryParams(redirectUrl, {
            error: `Le statut de l'étape projet n'a pas pu être modifié.`,
          })
        )
      }
    )
  })
)
