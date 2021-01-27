import routes from '../routes'
import { ImportCandidatesPage } from '../views/pages'
import { ensureLoggedIn, ensureRole } from './authentication'
import { v1Router } from './v1Router'

v1Router.get(
  routes.IMPORT_PROJECTS,
  ensureLoggedIn(),
  // ensureRole(['admin', 'dgec']),
  async (request, response) => {
    return response.send(
      ImportCandidatesPage({
        request,
      })
    )
  }
)
