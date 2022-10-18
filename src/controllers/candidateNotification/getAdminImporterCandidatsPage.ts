import asyncHandler from '../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import { AdminImporterCandidatsPage } from '@views'

v1Router.get(
  routes.IMPORT_PROJECTS,
  ensureRole(['admin', 'dgec-validateur']),
  asyncHandler(async (request, response) => {
    return response.send(
      AdminImporterCandidatsPage({
        request,
      })
    )
  })
)
