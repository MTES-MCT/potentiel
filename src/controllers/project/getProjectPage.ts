import asyncHandler from 'express-async-handler'
import { ensureRole } from '../../config'
import {
  getCahiersChargesURLs,
  getProjectDataForProjectPage,
  getProjectEvents,
} from '../../config/queries.config'
import { shouldUserAccessProject } from '../../config/useCases.config'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { EntityNotFoundError } from '@modules/shared'
import routes from '../../routes'
import { ProjectDetailsPage } from '../../views'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import { okAsync } from '../../core/utils'

const displayFrise = process.env.DISPLAY_NEW_FRISE === 'true'

v1Router.get(
  routes.PROJECT_DETAILS(),
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet', 'acheteur-obligé', 'ademe']),
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
        customMessage: `Votre compte ne vous permet pas d'à accéder à ce projet.`,
      })
    }

    await getProjectDataForProjectPage({ projectId, user })
      .andThen((project) => {
        const { appelOffreId, periodeId } = project

        return getCahiersChargesURLs(appelOffreId, periodeId).map((cahiersChargesURLs) => ({
          cahiersChargesURLs,
          project,
        }))
      })
      .andThen(({ cahiersChargesURLs, project }) =>
        displayFrise
          ? getProjectEvents({ projectId, user }).map((projectEventList) => ({
              cahiersChargesURLs,
              project,
              projectEventList,
            }))
          : okAsync({
              cahiersChargesURLs,
              project,
              projectEventList: undefined,
            })
      )
      .match(
        ({ cahiersChargesURLs, project, projectEventList }) => {
          return response.send(
            ProjectDetailsPage({
              request,
              project,
              cahiersChargesURLs,
              projectEventList,
              now: new Date().getTime(),
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
