import { listAllRequests } from '../useCases'
import { Redirect, Success } from '../helpers/responses'
import { Controller, HttpRequest } from '../types'
import { AdminListRequestsPage } from '../views/pages'
import ROUTES from '../routes'

const getAdminRequestsPage = async (request: HttpRequest) => {
  // console.log('Call to getAdminRequestsPage received', request.body, request.file)

  if (
    !request.user ||
    (request.user.role !== 'dgec' && request.user.role !== 'admin')
  ) {
    return Redirect(ROUTES.LOGIN)
  }

  const modificationRequests = await listAllRequests()

  return Success(
    AdminListRequestsPage({
      request,
      modificationRequests
    })
  )
}

export { getAdminRequestsPage }
