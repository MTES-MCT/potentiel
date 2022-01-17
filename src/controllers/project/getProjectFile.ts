import { loadFileForUser } from '../../config'
import { UniqueEntityID } from '../../core/domain'
import { FileAccessDeniedError, FileNotFoundError } from '@modules/file'
import { InfraNotAvailableError } from '../../modules/shared'
import routes from '../../routes'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import path from 'path'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'

v1Router.get(
  routes.DOWNLOAD_PROJECT_FILE(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { fileId } = request.params
    const { user } = request

    if (!validateUniqueId(fileId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Fichier' })
    }

    await loadFileForUser({
      fileId: new UniqueEntityID(fileId),
      user,
    }).match(
      async (fileStream) => {
        response.type(path.extname(request.path))
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
