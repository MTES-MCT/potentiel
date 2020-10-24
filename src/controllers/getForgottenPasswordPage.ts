import { Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { ForgottenPasswordPage } from '../views/pages'

const getForgottenPasswordPage = async (request: HttpRequest) => {
  return Success(
    ForgottenPasswordPage({
      request,
    })
  )
}
export { getForgottenPasswordPage }
