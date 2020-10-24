import { listUserRequests } from '../useCases'
import { Redirect, Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { UserListRequestsPage } from '../views/pages'
import ROUTES from '../routes'

const getUserRequestsPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const modificationRequests = await listUserRequests({
    userId: request.user?.id,
  })

  return Success(
    UserListRequestsPage({
      request,
      modificationRequests,
    })
  )
}

export { getUserRequestsPage }
