import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { updateStepStatus } from '../../config/useCases.config'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.UPDATE_PROJECT_STEP_STATUS(),
  ensureLoggedIn(),
  ensureRole(['dreal']),
  asyncHandler(async (request, response) => {
    const { user } = request
    const { projectId, newStatus, projectStepId } = request.params

    if (!projectId || !['à traiter', 'validé'].includes(newStatus)) {
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
          routes.SUCCESS_PAGE({
            success: `Le statut de l'étape projet a bien été mis à jour.`,
            redirectUrl: routes.ADMIN_DREAL_LIST,
            redirectTitle: 'Retourner à la liste des projets',
          })
        ),
      (e: Error) => {
        logger.error(e)
        return response.redirect(
          addQueryParams(routes.ADMIN_DREAL_LIST, {
            error: `Le statut de l'étape projet n'a pas pu être modifié.`,
          })
        )
      }
    )
  })
)
