import { getModificationRequestListForUser } from '../config/queries.config'
import { makePagination } from '../helpers/paginate'
import { Redirect, Success, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest, Pagination } from '../types'
import { ModificationRequestListPage } from '../views/pages'

export const getModificationRequestListPage = async (request: HttpRequest) => {
  const { user, cookies, query } = request

  if (!user) {
    return Redirect(ROUTES.LOGIN)
  }

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: +cookies?.pageSize || 10,
  }
  const pagination = makePagination(query, defaultPagination)

  return await getModificationRequestListForUser(user, pagination).match(
    (modificationRequests) =>
      Success(
        ModificationRequestListPage({
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
