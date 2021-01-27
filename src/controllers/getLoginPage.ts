import routes from '../routes'
import { LoginPage } from '../views/pages'
import { v1Router } from './v1Router'

v1Router.get(routes.LOGIN, async (request, response) => {
  if (request.user) {
    return response.redirect(routes.REDIRECT_BASED_ON_ROLE)
  }

  return response.send(
    LoginPage({
      request,
    })
  )
})
