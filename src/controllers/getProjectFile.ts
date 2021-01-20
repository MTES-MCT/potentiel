import { NotFoundError, SuccessFileStream, Redirect, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { loadFileForUser } from '../config'
import ROUTES from '../routes'
import { logger } from '../core/utils'
import { InfraNotAvailableError } from '../modules/shared'

const getProjectFile = async (request: HttpRequest) => {
  try {
    const { fileId } = request.params

    if (!request.user) {
      return Redirect(ROUTES.LOGIN)
    }

    const result = await loadFileForUser({ fileId, user: request.user })

    if (result.isErr()) {
      return SystemError(result.error.message)
    }

    return SuccessFileStream(result.value.contents)
  } catch (error) {
    if (error instanceof InfraNotAvailableError) {
      logger.error(error)
    } else {
      logger.warning(error.message)
    }

    return NotFoundError('Fichier introuvable.')
  }
}

export { getProjectFile }
