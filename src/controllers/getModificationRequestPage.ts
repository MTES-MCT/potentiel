import { Redirect, Success } from '../helpers/responses'
import { AdminModificationRequestDTO } from '../modules/modificationRequest'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { AdminModificationRequestPage } from '../views/pages'

const getModificationRequestPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  // TODO :Get the modification request DTO
  const modificationRequest = {} as AdminModificationRequestDTO

  return Success(AdminModificationRequestPage({ request, modificationRequest }))
}

export { getModificationRequestPage }
