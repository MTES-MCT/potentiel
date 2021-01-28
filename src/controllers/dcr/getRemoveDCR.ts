import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { removeDCR } from '../../useCases'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.SUPPRIMER_DCR_ACTION(),
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { user } = request
    const { projectId } = request.params
    ;(
      await removeDCR({
        user,
        projectId,
      })
    ).match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: 'La demande complète de raccordement a été retirée avec succès',
          })
        ),
      err: (e: Error) => {
        logger.error(e)
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: `La demande complète de raccordement n'a pas pu être retirée.`,
          })
        )
      },
    })
  })
)
