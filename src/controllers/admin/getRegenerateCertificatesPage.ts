import asyncHandler from 'express-async-handler'
import routes from '../../routes'
import { AdminRegenerateCertificatesPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.ADMIN_REGENERATE_CERTIFICATES,
  ensureLoggedIn(),
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    response.send(
      AdminRegenerateCertificatesPage({
        request,
      })
    )
  })
)
