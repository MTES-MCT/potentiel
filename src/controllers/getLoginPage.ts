import { HttpRequest } from '../types'
import { LoginPage } from '../views/pages'

const getLoginPage = async (request: HttpRequest) => {
  return {
    statusCode: 200,
    body: LoginPage({
      hasError: request.query.error === '1',
      success: request.query.success,
      email: request.query.email
    })
  }
}
export { getLoginPage }
