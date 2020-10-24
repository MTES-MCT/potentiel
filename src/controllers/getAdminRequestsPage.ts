import { listAllRequests } from '../useCases'
import { Redirect, Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { AdminListRequestsPage } from '../views/pages'
import ROUTES from '../routes'

const getAdminRequestsPage = async (request: HttpRequest) => {
  if (!request.user || (request.user.role !== 'dgec' && request.user.role !== 'admin')) {
    return Redirect(ROUTES.LOGIN)
  }

  const modificationRequests = await listAllRequests()

  return Success(
    AdminListRequestsPage({
      request,
      modificationRequests,
    })
  )
}

export { getAdminRequestsPage }
