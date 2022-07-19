import { ensureRole } from '@config'
import { getProjectDataForDemanderDelaiPage, getCahiersChargesURLs } from '@config/queries.config'
import { shouldUserAccessProject } from '@config/useCases.config'
import { EntityNotFoundError } from '@modules/shared'

import { logger } from '@core/utils'
import routes from '@routes'
import getValidationError from '../../helpers/getValidationError'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

import { DemanderDelaiPage } from '@views'

v1Router.get(
  routes.DEMANDER_DELAI(),
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const {
      user,
      query,
      params: { projectId },
    } = request

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

    await getProjectDataForDemanderDelaiPage(projectId).match(
      async (project) => {
        const { appelOffreId, periodeId } = project

        await getCahiersChargesURLs(appelOffreId, periodeId).match(
          (cahiersChargesURLs) => {
            return response.send(
              DemanderDelaiPage({
                request,
                project,
                validationErrors: getValidationError(query),
                cahiersChargesURLs,
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
      },
      //@ts-ignore
      (e) => {
        logger.error(e)
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
      }
    )
  })
)
