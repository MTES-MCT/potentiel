import routes from '../routes'
import { ForgottenPasswordPage } from '../views/pages'
import { v1Router } from './v1Router'

v1Router.get(routes.FORGOTTEN_PASSWORD, async (request, response) => {
  return response.send(
    ForgottenPasswordPage({
      request,
    })
  )
})
