import { LoginPage } from '../views/pages'

import { Controller, HttpRequest } from '../types'

export default function makeGetLoginPage(): Controller {
  return async (request: HttpRequest) => {
    return {
      statusCode: 200,
      body: LoginPage({
        hasError: request.query.error === '1',
        success: request.query.success,
        email: request.query.email
      })
    }
  }
}
