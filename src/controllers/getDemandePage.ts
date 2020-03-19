import { projectRepo } from '../dataAccess'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { ModificationRequestPage } from '../views/pages'
import { Success, Redirect } from '../helpers/responses'

const getDemandePage = async (request: HttpRequest) => {
  // console.log('Call to getDemandePage received', request.body, request.file)

  if (!request.query.projectId) {
    return {
      redirect: ROUTES.USER_DASHBOARD
    }
  }

  const projectResult = await projectRepo.findById(request.query.projectId)

  if (projectResult.is_none()) {
    return Redirect(ROUTES.USER_DASHBOARD, {
      error: "Le projet demandé n'existe pas"
    })
  }

  return Success(
    ModificationRequestPage({
      action: request.query.action,
      project: projectResult.unwrap(),
      success: request.query.success,
      error: request.query.error,
      userName: request.user.firstName + ' ' + request.user.lastName
    })
  )
}

export { getDemandePage }
