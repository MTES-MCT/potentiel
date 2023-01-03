import { ensureRole, getProjectAppelOffre, shouldUserAccessProject } from '@config'
import { projectRepo } from '@dataAccess'

import routes from '@routes'
import { validateUniqueId } from '../../../helpers/validateUniqueId'
import { notFoundResponse, unauthorizedResponse } from '../../helpers'
import asyncHandler from '../../helpers/asyncHandler'
import { v1Router } from '../../v1Router'

import { DemanderAbandonPage } from '@views'

v1Router.get(
  routes.DEMANDER_ABANDON(),
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const {
      user,
      params: { projectId },
    } = request

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const project = await projectRepo.findById(projectId)

    if (!project) {
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

    const { appelOffreId, periodeId, familleId } = project
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })
    if (!appelOffre) {
      return notFoundResponse({ request, response, ressourceTitle: 'AppelOffre' })
    }

    return response.send(
      DemanderAbandonPage({
        request,
        project,
        appelOffre,
      })
    )
  })
)
