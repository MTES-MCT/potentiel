import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { removeGarantiesFinancieres } from '../../useCases'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.SUPPRIMER_GARANTIES_FINANCIERES_ACTION(),
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'porteur-projet']),
  async (request, response) => {
    const { user } = request

    const { projectId } = request.params

    ;(
      await removeGarantiesFinancieres({
        user,
        projectId,
      })
    ).match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            success: 'Les garanties financières ont été retirées avec succès',
          })
        ),
      err: (error: Error) => {
        logger.error(error)
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: `Les garanties financières n'ont pas pu être retirées.`,
          })
        )
      },
    })
  }
)
