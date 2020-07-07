import { projectRepo } from '../dataAccess'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { Project } from '../entities'
import { ModificationRequestPage } from '../views/pages'
import { Success, Redirect } from '../helpers/responses'

const ACTIONS = [
  'delai',
  'actionnaire',
  // 'fournisseur',
  'puissance',
  'producteur',
  'abandon',
  'recours',
]

const getDemandePage = async (request: HttpRequest) => {
  // console.log('Call to getDemandePage received', request.body, request.query)

  if (!request.query.projectId || !ACTIONS.includes(request.query.action)) {
    return Redirect(ROUTES.USER_DASHBOARD)
  }

  const project = await projectRepo.findById(request.query.projectId)

  return project
    ? Success(
        ModificationRequestPage({
          request,
          project,
        })
      )
    : Redirect(ROUTES.USER_DASHBOARD, {
        error: "Le projet demandé n'existe pas",
      })
}

export { getDemandePage }
