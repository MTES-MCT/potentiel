import routes from '../../routes'
import { ImportCandidatesPage } from '../../views/legacy-pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.IMPORT_PROJECTS,
  ensureLoggedIn(),
  // ensureRole(['admin', 'dgec']),
  asyncHandler(async (request, response) => {
    return response.send(
      ImportCandidatesPage({
        request,
      })
    )
  })
)
