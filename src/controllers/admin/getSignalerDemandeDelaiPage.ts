import { ensureRole } from '@config'
import { getProjectDataForSignalerDemandeDelaiPage } from '@config/queries.config'
import { shouldUserAccessProject } from '@config/useCases.config'
import { EntityNotFoundError } from '@modules/shared'
import routes from '@routes'
import { SignalerDemandeDelaiPage } from '@views'
import getValidationError from '../../helpers/getValidationError'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.ADMIN_SIGNALER_DEMANDE_DELAI_PAGE(),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const { projectId } = request.params
    const { user, query } = request

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const userHasRightsToProject = await shouldUserAccessProject.check({
      user,
      projectId,
    })

    if (!userHasRightsToProject) {
      return unauthorizedResponse({
        request,
        response,
        customMessage: `Votre compte ne vous permet pas d'accéder à cette page.`,
      })
    }

    await getProjectDataForSignalerDemandeDelaiPage({ projectId }).match(
      (project) => {
        return response.send(
          SignalerDemandeDelaiPage({
            request,
            project,
            validationErrors: getValidationError(query),
          })
        )
      },
      (e) => {
        if (e instanceof EntityNotFoundError) {
          return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
        }

        return errorResponse({ request, response })
      }
    )
  })
)
