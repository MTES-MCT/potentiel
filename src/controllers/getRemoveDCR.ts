import { logger } from '../core/utils'
import { addQueryParams } from '../helpers/addQueryParams'
import routes from '../routes'
import { removeDCR } from '../useCases'
import { ensureLoggedIn, ensureRole } from './authentication'
import { v1Router } from './v1Router'

v1Router.get(
  routes.SUPPRIMER_DCR_ACTION(),
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'porteur-projet']),
  async (request, response) => {
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
  }
)
