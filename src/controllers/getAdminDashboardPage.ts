import { AdminDashboardPage } from '../views/pages'

export default function makeGetAdminDashboardPage(): ENR.Controller {
  return async (request: ENR.HttpRequest) => {
    return {
      statusCode: 200,
      body: AdminDashboardPage({
        adminName: request.user.firstName + ' ' + request.user.lastName
      })
    }
  }
}
