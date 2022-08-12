import asyncHandler from '../helpers/asyncHandler'
import routes from '@routes'
import { AdminAppelOffrePage } from '@views/legacy-pages'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.ADMIN_AO_PERIODE,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    return response.send(AdminAppelOffrePage({ request }))
  })
)
