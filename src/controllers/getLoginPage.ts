import { Success, Redirect } from '../helpers/responses'
import { HttpRequest } from '../types'
import { LoginPage } from '../views/pages'
import routes from '../routes'

const getLoginPage = async (request: HttpRequest) => {
  if (request.user) {
    return Redirect(routes.REDIRECT_BASED_ON_ROLE)
  }

  return Success(
    LoginPage({
      request,
    })
  )
}
export { getLoginPage }
