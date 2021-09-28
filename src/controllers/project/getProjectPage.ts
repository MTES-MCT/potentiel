import asyncHandler from 'express-async-handler'
import { getCahiersChargesURLs, getProjectDataForProjectPage } from '../../config/queries.config'
import { shouldUserAccessProject } from '../../config/useCases.config'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ProjectDetailsPage } from '../../views/legacy-pages'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'

v1Router.get(
  routes.PROJECT_DETAILS(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet', 'acheteur-obligé', 'ademe']),
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

        return getCahiersChargesURLs(appelOffreId, periodeId).map((cahiersChargesURLs) => ({
          cahiersChargesURLs,
          project,
        }))
      })
      .match(
        ({ cahiersChargesURLs, project }) => {
          return response.send(
            ProjectDetailsPage({
              request,
              project,
              cahiersChargesURLs,
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
