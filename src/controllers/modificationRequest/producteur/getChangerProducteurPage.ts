import { ensureRole } from '@config'
import { getProjectAppelOffre } from '@config/queries.config'
import { shouldUserAccessProject } from '@config/useCases.config'
import { projectRepo } from '@dataAccess'

import routes from '@routes'
import { validateUniqueId } from '../../../helpers/validateUniqueId'
import { notFoundResponse, unauthorizedResponse } from '../../helpers'
import asyncHandler from '../../helpers/asyncHandler'
import { v1Router } from '../../v1Router'

import { ChangerProducteurPage } from '@views'

v1Router.get(
  routes.CHANGER_PRODUCTEUR(),
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

    // Changement de producteur interdit avant la date d'achèvement
    // La date d'achèvement n'est pas encore une information à saisir dans Potentiel
    if (project.appelOffre?.type === 'eolien') {
      return unauthorizedResponse({
        request,
        response,
        customMessage: `L'action demandée n'est pas possible pour ce projet`,
      })
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
      ChangerProducteurPage({
        request,
        project,
        appelOffre,
      })
    )
  })
)
