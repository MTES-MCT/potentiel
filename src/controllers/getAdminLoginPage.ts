import { AdminLoginPage } from '../views/pages'
import logger from '../helpers/logger'

export default function makeGetAdminLoginPage() {
  return async (request: ENR.HttpRequest) => {
    return {
      statusCode: 200,
      body: AdminLoginPage({ hasError: request.query.error === '1' })
    }
  }
}
