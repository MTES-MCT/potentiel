import { listUserProjects } from '../useCases'
import { User } from '../entities'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import { UserDashboardPage } from '../views/pages'

export default function makeGetUserDashboard(): Controller {
  return async (request: HttpRequest) => {
    console.log('Call to getUserDashboard received', request.body, request.file)

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
}
