import { AdminLoginPage } from '../views/pages'

import { Controller, HttpRequest } from '../types'

export default function makeGetAdminLoginPage(): Controller {
  return async (request: HttpRequest) => {
    return {
      statusCode: 200,
      body: AdminLoginPage({ hasError: request.query.error === '1' })
    }
  }
}
