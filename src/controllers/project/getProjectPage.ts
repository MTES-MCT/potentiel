import asyncHandler from 'express-async-handler'
import { getCahierChargesURL, getProjectDataForProjectPage } from '../../config/queries.config'
import { shouldUserAccessProject } from '../../config/useCases.config'
import { okAsync } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ProjectDetailsPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.PROJECT_DETAILS(),
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet', 'acheteur-obligé']),
  asyncHandler(async (request, response) => {
    const { projectId } = request.params
    const { user } = request

    const userHasRightsToProject = await shouldUserAccessProject.check({
      user,
      projectId,
    })

    if (!userHasRightsToProject) {
      return response.status(403).send('Vous n‘êtes pas autorisé à consulter ce projet.')
    }

    return await getProjectDataForProjectPage({ projectId, user })
      .andThen((project) => {
        const { appelOffreId, periodeId } = project

        return getCahierChargesURL(appelOffreId, periodeId).map((cahierChargesURL) => ({
          cahierChargesURL,
          project,
        }))
      })
      .match(
        ({ cahierChargesURL, project }) => {
          return response.send(
            ProjectDetailsPage({
              request,
              project,
              cahierChargesURL,
            })
          )
        },
        () => {
          const redirectTo = ['porteur-projet', 'acheteur-oblige'].includes(user.role)
            ? routes.USER_DASHBOARD
            : routes.ADMIN_DASHBOARD
          return response.redirect(
            addQueryParams(redirectTo, {
              error:
                'Une erreur est survenue. Merci de réessayer ou de contacter un administrateur.',
            })
          )
        }
      )
  })
)
