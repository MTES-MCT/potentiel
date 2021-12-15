import asyncHandler from 'express-async-handler'
import { ensureRole, eventStore, loadFileForUser } from '../../config'
import { UniqueEntityID } from '../../core/domain'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { FileAccessDeniedError, FileNotFoundError } from '../../modules/file'
import { ProjectCertificateDownloaded } from '../../modules/project/events'
import { InfraNotAvailableError } from '../../modules/shared'
import routes from '../../routes'
import { notFoundResponse, unauthorizedResponse, errorResponse } from '../helpers'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.DOWNLOAD_CERTIFICATE_FILE(),
  ensureRole(['admin', 'dgec', 'porteur-projet', 'acheteur-obligé']),
  asyncHandler(async (request, response) => {
    const { projectId, fileId } = request.params
    const { user } = request

    if (!validateUniqueId(fileId) || !validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Fichier' })
    }

    await loadFileForUser({
      fileId: new UniqueEntityID(fileId),
      user,
    }).match(
      async (fileStream) => {
        if (user.role === 'porteur-projet') {
          await eventStore.publish(
            new ProjectCertificateDownloaded({
              payload: {
                projectId,
                certificateFileId: fileId,
                downloadedBy: user.id,
              },
            })
          )
        }

        response.type('pdf')
        fileStream.contents.pipe(response)
        return response.status(200)
      },
      async (e) => {
        if (e instanceof FileNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Fichier' })
        } else if (e instanceof FileAccessDeniedError) {
          return unauthorizedResponse({ request, response })
        } else if (e instanceof InfraNotAvailableError) {
          return errorResponse({ request, response })
        }
      }
    )
  })
)
