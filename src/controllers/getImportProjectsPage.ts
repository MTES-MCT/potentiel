import { HttpRequest } from '../types'
import { ImportCandidatesPage } from '../views/pages'
import { Success, SystemError } from '../helpers/responses'
import { logger } from '../core/utils'

const getImportProjectsPage = async (request: HttpRequest) => {
  try {
    return Success(
      ImportCandidatesPage({
        request,
      })
    )
  } catch (error) {
    logger.error(error)
    return SystemError('Erreur système')
  }
}

export { getImportProjectsPage }
