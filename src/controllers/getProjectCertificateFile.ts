import { eventStore, loadFileForUser } from '../config'
import { NotFoundError, Redirect, SuccessFileStream, SystemError } from '../helpers/responses'
import { ProjectCertificateDownloaded } from '../modules/project/events'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { logger } from '../core/utils'

const getProjectCertificateFile = async (request: HttpRequest) => {
  try {
    const { projectId, fileId } = request.params

    if (!request.user) {
      return Redirect(ROUTES.LOGIN)
    }

    const result = await loadFileForUser({ fileId, user: request.user })

    if (result.isErr()) {
      return SystemError(result.error.message)
    }

    if (request.user.role === 'porteur-projet') {
      await eventStore.publish(
        new ProjectCertificateDownloaded({
          payload: {
            projectId,
            certificateFileId: fileId,
            downloadedBy: request.user.id,
          },
        })
      )
    }

    return SuccessFileStream(result.value.contents)
  } catch (error) {
    logger.error(error)
    return NotFoundError('Fichier introuvable.')
  }
}

export { getProjectCertificateFile }
