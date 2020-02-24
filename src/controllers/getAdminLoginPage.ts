import { AdminLoginPage } from '../views/pages'

export default function makeGetAdminLoginPage() {
  return async (request: ENR.HttpRequest) => {
    return {
      statusCode: 200,
      body: AdminLoginPage()
    }
  }
}
