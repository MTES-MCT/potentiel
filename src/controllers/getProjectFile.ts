import { NotFoundError, SuccessFileStream, Redirect, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import { fileService } from '../config'
import ROUTES from '../routes'

const getProjectFile = async (request: HttpRequest) => {
  try {
    const { fileId } = request.params

    if (!request.user) {
      return Redirect(ROUTES.LOGIN)
    }

    console.log('getProjectFile with fileId', fileId)

    const result = await fileService.load(fileId, request.user)

    if (result.isErr()) {
      return SystemError(result.error.message)
    }

    return SuccessFileStream(result.value.stream)
  } catch (error) {
    console.log('getProjectFile error', error)
    return NotFoundError('Fichier introuvable.')
  }
}

export { getProjectFile }
