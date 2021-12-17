import asyncHandler from 'express-async-handler'
import { revokeUserRightsToProject } from '../../config/useCases.config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { UnauthorizedError } from '../../modules/shared'
import routes from '../../routes'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'

v1Router.get(
  routes.REVOKE_USER_RIGHTS_TO_PROJECT_ACTION(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  asyncHandler(async (request, response) => {
    const { userId, projectId } = request.query as any
    const { user } = request

    const redirectTo = routes.PROJECT_DETAILS(projectId)

    if (!validateUniqueId(userId) || !validateUniqueId(projectId)) {
      return notFoundResponse({ request, response })
    }

    ;(
      await revokeUserRightsToProject({
        projectId,
        userId,
        revokedBy: user,
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(redirectTo, {
            success: `Vous avez bien révoqué les droits sur ce projet pour cet utilisateur`,
          })
        ),
      (error) => {
        if (error instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response })
        }

        logger.error(error)
        return errorResponse({ request, response })
      }
    )
  })
)
