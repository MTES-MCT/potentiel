import asyncHandler from 'express-async-handler'
import { userRepo } from '../../dataAccess'
import routes from '../../routes'
import { AdminUsersPage } from '@views/legacy-pages'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.ADMIN_USERS,
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const users = await userRepo.findAll({ role: ['acheteur-obligé', 'ademe'] })

    return response.send(AdminUsersPage({ request, users }))
  })
)
