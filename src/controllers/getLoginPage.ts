import { Success } from '../helpers/responses'
import { HttpRequest } from '../types'
import { LoginPage } from '../views/pages'

const getLoginPage = async (request: HttpRequest) => {
  return Success(
    LoginPage({
      hasError: request.query.error === '1',
      success: request.query.success,
      email: request.query.email
    })
  )
}
export { getLoginPage }
