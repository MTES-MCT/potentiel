import { getModificationRequestDetails } from '../config'
import { logger } from '../core/utils'
import { addQueryParams } from '../helpers/addQueryParams'
import routes from '../routes'
import { ModificationRequestDetailsPage } from '../views/pages'
import { ensureLoggedIn, ensureRole } from './authentication'
import { v1Router } from './v1Router'

v1Router.get(
  routes.DEMANDE_PAGE_DETAILS(),
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  async (request, response) => {
    const isAdmin = ['admin', 'dgec'].includes(request.user.role)

    const modificationRequestResult = await getModificationRequestDetails(
      request.params.modificationRequestId
    )

    return modificationRequestResult.match(
      (modificationRequest) => {
        response.send(ModificationRequestDetailsPage({ request, modificationRequest }))
      },
      (e) => {
        logger.error(e)
        response.redirect(
          addQueryParams(isAdmin ? routes.ADMIN_LIST_REQUESTS : routes.USER_LIST_REQUESTS, {
            error: e.message,
          })
        )
      }
    )
  }
)
