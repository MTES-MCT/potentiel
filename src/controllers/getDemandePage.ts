import { projectRepo } from '../dataAccess'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { Project } from '../entities'
import { ModificationRequestPage } from '../views/pages'
import { Success, Redirect } from '../helpers/responses'

const getDemandePage = async (request: HttpRequest) => {
  // console.log('Call to getDemandePage received', request.body, request.file)

  if (!request.query.projectId) {
    return Redirect(ROUTES.USER_DASHBOARD)
  }

  const projectResult = await projectRepo.findById(request.query.projectId)

  return projectResult.match({
    some: (project: Project) =>
      Success(
        ModificationRequestPage({
          request,
          project
        })
      ),
    none: () =>
      Redirect(ROUTES.USER_DASHBOARD, {
        error: "Le projet demandé n'existe pas"
      })
  })
}

export { getDemandePage }
