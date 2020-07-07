import { Redirect, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { inviteUserToProject } from '../useCases'
import moment from 'moment'

const FORMAT_DATE = 'DD/MM/YYYY'

const postInviteUserToProject = async (request: HttpRequest) => {
  const { email, projectId } = request.body
  const { user } = request

  if (!user) {
    return SystemError('User must be logged in')
  }

  const result = await inviteUserToProject({
    email,
    projectId,
    user,
  })

  return result.match({
    ok: () =>
      Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        success: 'Une invitation a bien été envoyée à ' + email,
      }),
    err: (error: Error) =>
      Redirect(ROUTES.PROJECT_DETAILS(projectId), {
        error: error.message,
      }),
  })
}
export { postInviteUserToProject }
