import { Redirect, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { listUserProjects } from '../useCases'
import { UserListProjectsPage } from '../views/pages'

const getUserDashboardPage = async (request: HttpRequest) => {
  // console.log('Call to getUserDashboardPage received')

  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const projects = await listUserProjects({ userId: request.user.id })

  return Success(
    UserListProjectsPage({
      request,
      projects
    })
  )
}
export { getUserDashboardPage }
