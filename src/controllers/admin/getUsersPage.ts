import { projectAdmissionKeyRepo, userRepo } from '../../dataAccess'
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
    const users = await userRepo.findAll({ role: ['acheteur-obligé', 'ademe'] })

    // Get all invitations for dreals
    const invitations = await projectAdmissionKeyRepo.findAll({
      forRole: -1,
      lastUsedAt: 0,
    })

    return response.send(AdminUsersPage({ request, users, invitations }))
  })
)
