import asyncHandler from '../helpers/asyncHandler'
import routes from '../../routes'
import { ImportCandidatesPage } from '@views/legacy-pages'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.IMPORT_PROJECTS,
  ensureRole(['admin', 'dgec']),
  asyncHandler(async (request, response) => {
    return response.send(
      ImportCandidatesPage({
        request,
      })
    )
  })
)
