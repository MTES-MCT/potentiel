import { Redirect, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { listUserProjects } from '../useCases'
import { UserDashboardPage } from '../views/pages'

const getUserDashboardPage = async (request: HttpRequest) => {
  // console.log(
  //   'Call to getUserDashboardPage received',
  //   request.body,
  //   request.file
  // )

  if (!request.user) {ogin')
    return Redirect(ROUTES.LOGIN)
  }

  let projects
  try {
    projects = await listUserProjects({ userId: request.user.id })
  } catch (error) {
    console.log('listUserProjects errored', error)
  }

  return Success(
    UserDashboardPage({
      projects,
      userName: request.user.firstName + ' ' + request.user.lastName
    })
  )
}
export { getUserDashboardPage }
