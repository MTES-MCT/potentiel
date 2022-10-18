import asyncHandler from '../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { AdminRegénérerPeriodeAttestationsPage } from '@views'

v1Router.get(
  routes.ADMIN_REGENERATE_CERTIFICATES,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    response.send(
      AdminRegénérerPeriodeAttestationsPage({
        request,
      })
    )
  })
)
