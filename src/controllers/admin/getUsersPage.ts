import { appelOffreRepo, projectAdmissionKeyRepo } from '../../dataAccess'
import { makePagination } from '../../helpers/paginate'
import routes from '../../routes'
import { Pagination } from '../../types'
import { AdminUsersPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.ADMIN_USERS,
  ensureLoggedIn(),
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    return response.send(AdminUsersPage({ request }))
  })
)
