import { projectRepo } from '../../dataAccess'
import { addQueryParams } from '../../helpers/addQueryParams'
import { NewModificationRequestPage } from '../../views/pages'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

const ACTIONS = ['delai', 'actionnaire', 'puissance', 'producteur', 'abandon', 'recours']

v1Router.get(
  routes.DEMANDE_GENERIQUE,
  ensureLoggedIn(),
  ensureRole('porteur-projet'),
  async (request, response) => {
    if (!request.query.projectId || !ACTIONS.includes(request.query.action)) {
      return response.redirect(routes.USER_DASHBOARD)
    }

    const project = await projectRepo.findById(request.query.projectId)

    return project
      ? response.send(
          NewModificationRequestPage({
            request,
            project,
          })
        )
      : response.redirect(
          addQueryParams(routes.USER_DASHBOARD, {
            error: "Le projet demandé n'existe pas",
          })
        )
  }
)
