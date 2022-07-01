import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '@routes'
import { inviteUserToProject } from '@config'
import { ensureRole } from '@config'
import { v1Router } from '../v1Router'
import asyncHandler from '../helpers/asyncHandler'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { UnauthorizedError } from '@modules/shared'
import { logger } from '@core/utils'

v1Router.post(
  routes.INVITE_USER_TO_PROJECT_ACTION,
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { email, projectId } = request.body
    const { user } = request

    const projectIds = Array.isArray(projectId) ? projectId : [projectId]

    if (!projectIds.every((projectId) => validateUniqueId(projectId))) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      })
    }

    const redirectTo = Array.isArray(projectId)
      ? user.role === 'porteur-projet'
        ? routes.USER_LIST_PROJECTS
        : routes.ADMIN_LIST_PROJECTS
      : routes.PROJECT_DETAILS(projectId)
    ;(
      await inviteUserToProject({
        email: email.toLowerCase(),
        projectIds,
        invitedBy: user,
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(redirectTo, {
            success: 'Une invitation a bien été envoyée à ' + email,
          })
        ),
      (error) => {
        if (error instanceof UnauthorizedError) {
          return unauthorizedResponse({ response, request })
        }

        logger.error(error)

        return errorResponse({ request, response })
      }
    )
  })
)
