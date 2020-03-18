import { Project } from '../entities'
import { HttpRequest } from '../types'
import { listProjects } from '../useCases'
import { AdminDashboardPage } from '../views/pages'
import { Success } from '../helpers/responses'

const getAdminDashboardPage = async (
  request: HttpRequest,
  context: any = {}
) => {
  // console.log('adminPage request.query', request.query)

  let projects: Array<Project>
  try {
    projects = await listProjects({})
  } catch (e) {
    console.log('ListProjects error', e)
    return {
      statusCode: 500,
      body:
        'Erreur lors de la récupération de la liste des projets (' +
        e.error +
        ')'
    }
  }

  return Success(
    AdminDashboardPage({
      userName: request.user.firstName + ' ' + request.user.lastName,
      success: request.query.success,
      error: request.query.error,
      projects
    })
  )
}

export { getAdminDashboardPage }
