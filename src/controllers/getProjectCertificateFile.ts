import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import {
  NotFoundError,
  SuccessFileStream,
  Redirect,
  SystemError,
} from '../helpers/responses'
import { HttpRequest } from '../types'
import { fileService, eventStore } from '../config'
import ROUTES from '../routes'
import { ProjectCertificateDownloaded } from '../modules/project/events'

const getProjectCertificateFile = async (request: HttpRequest) => {
  // console.log('Call to getProjectCertificateFile received', request.query, request.file)

  try {
    const { projectId, fileId } = request.params

    if (!request.user) {
      return Redirect(ROUTES.LOGIN)
    }

    const result = await fileService.load(fileId, request.user)

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
          aggregateId: projectId,
        })
      )
    }

    return SuccessFileStream(result.value.stream)
  } catch (error) {
    console.log('getProjectCertificateFile error', error)
    return NotFoundError('Fichier introuvable.')
  }
}

export { getProjectCertificateFile }
