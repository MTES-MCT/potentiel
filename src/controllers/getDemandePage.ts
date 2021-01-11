import { projectRepo } from '../dataAccess'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { NewModificationRequestPage } from '../views/pages'
import { Success, Redirect } from '../helpers/responses'

const ACTIONS = ['delai', 'actionnaire', 'puissance', 'producteur', 'abandon', 'recours']

const getDemandePage = async (request: HttpRequest) => {
  if (!request.query.projectId || !ACTIONS.includes(request.query.action)) {
    return Redirect(ROUTES.USER_DASHBOARD)
  }

  const project = await projectRepo.findById(request.query.projectId)

  return project
    ? Success(
        NewModificationRequestPage({
          request,
          project,
        })
      )
    : Redirect(ROUTES.USER_DASHBOARD, {
        error: "Le projet demandé n'existe pas",
      })
}

export { getDemandePage }
