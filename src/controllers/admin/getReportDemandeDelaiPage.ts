import { ensureRole } from '@config'
import asyncHandler from '../helpers/asyncHandler'
import { getProjectDataForReportPage } from '@config/queries.config'
import { shouldUserAccessProject } from '@config/useCases.config'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { EntityNotFoundError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import { ReportDemandeDelaiPage } from '@views'

v1Router.get(
  routes.ADMIN_REPORT_DEMANDE_DELAI(),
  ensureRole(['admin', 'dgec', 'dreal']),
  asyncHandler(async (request, response) => {
    const { projectId } = request.params
    const { user } = request

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
        customMessage: `Votre compte ne vous permet pas d'accéder à ce projet.`,
      })
    }

    await getProjectDataForReportPage({ projectId }).match(
      (project) => {
        return response.send(
          ReportDemandeDelaiPage({
            request,
            project,
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
