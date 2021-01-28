import { getModificationRequestListForUser } from '../../config/queries.config'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { logger } from '../../core/utils'
import { Pagination } from '../../types'
import { ModificationRequestListPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

const getModificationRequestListPage = asyncHandler(async (request, response) => {
  const { user, cookies, query } = request

  const defaultPagination: Pagination = {
    page: 0,
    pageSize: Number(cookies?.pageSize) || 10,
  }
  const pagination = makePagination(query, defaultPagination)

  return await getModificationRequestListForUser(user, pagination).match(
    (modificationRequests) =>
      response.send(
        ModificationRequestListPage({
          request,
          modificationRequests,
        })
      ),
    (e) => {
      logger.error(e)
      return response
        .status(500)
        .send('Impossible de charger la liste des demandes. Merci de réessayer plus tard.')
    }
  )
})

v1Router.get(
  routes.ADMIN_LIST_REQUESTS,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  getModificationRequestListPage
)

v1Router.get(
  routes.USER_LIST_REQUESTS,
  ensureLoggedIn(),
  ensureRole(['porteur-projet']),
  getModificationRequestListPage
)
