import { listUserRequests } from '../useCases'
import { Redirect, Success } from '../helpers/responses'
import { Controller, HttpRequest } from '../types'
import { UserListRequestsPage } from '../views/pages'
import ROUTES from '../routes'

const getUserRequestsPage = async (request: HttpRequest) => {
  // console.log('Call to getUserRequestsPage received', request.body, request.file)

  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const modificationRequests = await listUserRequests({
    userId: request.user?.id
  })

  return Success(
    UserListRequestsPage({
      request,
      modificationRequests
    })
  )
}

export { getUserRequestsPage }
