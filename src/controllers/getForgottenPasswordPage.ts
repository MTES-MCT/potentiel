import { Success, Redirect } from '../helpers/responses'
import { HttpRequest } from '../types'
import { ForgottenPasswordPage } from '../views/pages'
import routes from '../routes'

const getForgottenPasswordPage = async (request: HttpRequest) => {
  return Success(
    ForgottenPasswordPage({
      request,
    })
  )
}
export { getForgottenPasswordPage }
