import { getModificationRequestDetails } from '../config'
import { Redirect, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { ModificationRequestDetailsPage } from '../views/pages'
import { logger } from '../core/utils'

const getModificationRequestPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const isAdmin = ['admin', 'dgec'].includes(request.user.role)

  const modificationRequestResult = await getModificationRequestDetails(
    request.params.modificationRequestId
  )

  return modificationRequestResult.match(
    (modificationRequest) =>
      Success(ModificationRequestDetailsPage({ request, modificationRequest })),
    (e) => {
      logger.error(e)
      return Redirect(isAdmin ? ROUTES.ADMIN_LIST_REQUESTS : ROUTES.USER_LIST_REQUESTS, {
        error: e.message,
      })
    }
  )
}

export { getModificationRequestPage }
