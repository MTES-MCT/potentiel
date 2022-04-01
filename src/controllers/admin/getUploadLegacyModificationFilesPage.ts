import { ensureRole } from '@config'
import routes from '../../routes'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import { UploadLegacyModificationFilesPage } from '@views'

v1Router.get(
  routes.UPLOAD_LEGACY_MODIFICATION_FILES,
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    return response.send(UploadLegacyModificationFilesPage({ request }))
  })
)
