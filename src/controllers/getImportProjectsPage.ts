import { Project } from '../entities'
import { HttpRequest } from '../types'
import { listProjects } from '../useCases'
import { ImportCandidatesPage } from '../views/pages'
import { Success } from '../helpers/responses'

const getImportProjectsPage = async (request: HttpRequest) => {
  // console.log('getAdminDashboardPage request.query', request.query)
  return Success(
    ImportCandidatesPage({
      request
    })
  )
}

export { getImportProjectsPage }
