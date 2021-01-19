import { Redirect, Success, SystemError } from '../helpers/responses'
import { HttpRequest, Pagination } from '../types'
import { AdminListRequestsPage } from '../views/pages'
import ROUTES from '../routes'
import { getModificationRequestListForUser } from '../config/queries.config'
import { makePagination } from '../helpers/paginate'

const getAdminRequestsPage = async (request: HttpRequest) => {
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
        AdminListRequestsPage({
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

export { getAdminRequestsPage }
