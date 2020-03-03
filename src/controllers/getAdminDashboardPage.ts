import { AdminDashboardPage } from '../views/pages'

import { Controller, HttpRequest } from '../types'

export default function makeGetAdminDashboardPage(): Controller {
  return async (request: HttpRequest, context: any = {}) => {
    console.log('adminPage request.query', request.query)
    return {
      statusCode: 200,
      body: AdminDashboardPage({
        userName: request.user.firstName + ' ' + request.user.lastName,
        success: request.query.success,
        error: request.query.error
      })
    }
  }
}
