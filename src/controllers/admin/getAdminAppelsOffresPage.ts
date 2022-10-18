import asyncHandler from '../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { AdminAppelsOffresPage } from '@views'

v1Router.get(
  routes.ADMIN_AO_PERIODE,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    return response.send(AdminAppelsOffresPage({ request }))
  })
)
