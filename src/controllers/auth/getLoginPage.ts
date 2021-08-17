import routes from '../../routes'
import { LoginPage } from '../../views/legacy-pages'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.LOGIN,
  asyncHandler(async (request, response) => {
    if (request.user) {
      return response.redirect(routes.REDIRECT_BASED_ON_ROLE)
    }

    return response.send(
      LoginPage({
        request,
      })
    )
  })
)
