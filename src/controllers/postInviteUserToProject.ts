import { Redirect, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { inviteUserToProject } from '../useCases'

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

  const isMultiProject = Array.isArray(projectId)

  const redirectTo = isMultiProject
    ? user.role === 'porteur-projet'
      ? ROUTES.USER_LIST_PROJECTS
      : ROUTES.ADMIN_LIST_PROJECTS
    : ROUTES.PROJECT_DETAILS(projectId)

  return result.match({
    ok: () =>
      Redirect(redirectTo, {
        success: 'Une invitation a bien été envoyée à ' + email,
      }),
    err: (error: Error) =>
      Redirect(redirectTo, {
        error: error.message,
      }),
  })
}
export { postInviteUserToProject }
