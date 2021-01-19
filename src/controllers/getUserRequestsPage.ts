import { getModificationRequestListForUser } from '../config/queries.config'
import { makePagination } from '../helpers/paginate'
import { Redirect, Success, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest, Pagination } from '../types'
import { UserListRequestsPage } from '../views/pages'

const getUserRequestsPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: +request.cookies?.pageSize || 10,
  }
  const pagination = makePagination(request.query, defaultPagination)

  return await getModificationRequestListForUser(request.user, pagination).match(
    (modificationRequests) =>
      Success(
        UserListRequestsPage({
          request,
          modificationRequests,
        })
      ),
    (e) => {
      console.error(e)
      return SystemError(
        'Impossible de charger la liste des demandes. Merci de réessayer plus tard.'
      )
    }
  )
}

export { getUserRequestsPage }
