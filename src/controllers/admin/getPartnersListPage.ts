import { userRepo } from '@dataAccess'
import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { PartnersListPage } from '@views'

v1Router.get(
  routes.ADMIN_PARTNER_USERS,
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const users = await userRepo.findAll({ role: ['acheteur-obligé', 'ademe'] })

    return response.send(PartnersListPage({ request, users }))
  })
)
