import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { listUserProjects } from '../useCases'
import { UserDashboardPage } from '../views/pages'

const getUserDashboardPage = async (request: HttpRequest) => {
  console.log(
    'Call to getUserDashboardPage received',
    request.body,
    request.file
  )

  if (!request.user) {
    return {
      redirect: ROUTES.LOGIN
    }
  }

  let projects
  try {
    projects = await listUserProjects({ userId: request.user.id })
  } catch (error) {
    console.log('listUserProjects errored', error)
  }

  // console.log('user projects found')

  // return {
  //   redirect: ROUTES.WHATEVER,
  //   query: { param: "value" }
  // }

  return {
    statusCode: 200,
    body: UserDashboardPage({
      projects,
      userName: request.user.firstName + ' ' + request.user.lastName
    })
  }
}
export { getUserDashboardPage }
