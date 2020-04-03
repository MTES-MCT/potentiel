import { Project } from '../entities'
import { HttpRequest } from '../types'
import { listProjects } from '../useCases'
import { ImportCandidatesPage } from '../views/pages'
import { Success, SystemError } from '../helpers/responses'

import { appelOffreRepo } from '../dataAccess'

const getImportProjectsPage = async (request: HttpRequest) => {
  try {
    // TODO: Move this to a use-case
    const appelsOffre = await appelOffreRepo.findAll()

    return Success(
      ImportCandidatesPage({
        request,
        appelsOffre
      })
    )
  } catch (error) {
    console.log('Error in getImportPage', error)
    return SystemError('Erreur système')
  }
}

export { getImportProjectsPage }
