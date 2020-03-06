import { AdminDashboardPage } from '../views/pages'
import { Project } from '../entities'
import { listProjects } from '../useCases'
import { Controller, HttpRequest } from '../types'

export default function makeGetAdminDashboardPage(): Controller {
  return async (request: HttpRequest, context: any = {}) => {
    console.log('adminPage request.query', request.query)

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

    return {
      statusCode: 200,
      body: AdminDashboardPage({
        userName: request.user.firstName + ' ' + request.user.lastName,
        success: request.query.success,
        error: request.query.error,
        projects
      })
    }
  }
}
