import routes from '../../routes'
import { ForgottenPasswordPage } from '../../views/legacy-pages'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.FORGOTTEN_PASSWORD,
  asyncHandler(async (request, response) => {
    return response.send(
      ForgottenPasswordPage({
        request,
      })
    )
  })
)
