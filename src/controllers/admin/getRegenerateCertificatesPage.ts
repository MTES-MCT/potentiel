import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { AdminRegenerateCertificatesPage } from '@views/legacy-pages'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.ADMIN_REGENERATE_CERTIFICATES,
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    response.send(
      AdminRegenerateCertificatesPage({
        request,
      })
    )
  })
)
