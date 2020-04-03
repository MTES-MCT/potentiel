import { Project } from '../entities'
import { HttpRequest } from '../types'
import { listProjects } from '../useCases'
import { ImportCandidatesPage } from '../views/pages'
import { Success } from '../helpers/responses'

import { appelOffreRepo } from '../dataAccess'

const getImportProjectsPage = async (request: HttpRequest) => {
  // console.log('getAdminDashboardPage request.query', request.query)

  // TODO: Move this to a use-case
  const appelsOffre = await appelOffreRepo.findAll()

  return Success(
    ImportCandidatesPage({
      request,
      appelsOffre
    })
  )
}

export { getImportProjectsPage }
