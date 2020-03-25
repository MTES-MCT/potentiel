import { Project } from '../entities'
import { HttpRequest } from '../types'
import { listProjects } from '../useCases'
import { AdminDashboardPage } from '../views/pages'
import { Success } from '../helpers/responses'

const getAdminDashboardPage = async (request: HttpRequest) => {
  // console.log('getAdminDashboardPage request.query', request.query)
  const projects = await listProjects({})
  return Success(
    AdminDashboardPage({
      request,
      projects
    })
  )
}

export { getAdminDashboardPage }
