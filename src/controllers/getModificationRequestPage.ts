import { getModificationRequestDetails } from '../config'
import { Redirect, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { AdminModificationRequestPage } from '../views/pages'

const getModificationRequestPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const modificationRequestResult = await getModificationRequestDetails(
    request.params.modificationRequestId
  )

  return modificationRequestResult.match(
    (modificationRequest) =>
      Success(AdminModificationRequestPage({ request, modificationRequest })),
    (e) => {
      console.error('getModificationRequestPage error', e)
      return Redirect(ROUTES.ADMIN_LIST_REQUESTS, { error: e.message })
    }
  )
}

export { getModificationRequestPage }
