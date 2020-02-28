import { AdminDashboardPage } from '../views/pages'

import { Controller, HttpRequest } from '../types'

export default function makeGetAdminDashboardPage(): Controller {
  return async (request: HttpRequest) => {
    return {
      statusCode: 200,
      body: AdminDashboardPage({
        adminName: request.user.firstName + ' ' + request.user.lastName
      })
    }
  }
}
