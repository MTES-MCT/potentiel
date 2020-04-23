import { HttpRequest } from '../types'
import { ImportCandidatesPage } from '../views/pages'
import { Success, SystemError } from '../helpers/responses'

const getImportProjectsPage = async (request: HttpRequest) => {
  try {
    return Success(
      ImportCandidatesPage({
        request,
      })
    )
  } catch (error) {
    console.log('Error in getImportPage', error)
    return SystemError('Erreur système')
  }
}

export { getImportProjectsPage }
