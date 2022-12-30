import { ensureRole, getProjectAppelOffre } from '@config'
import { projectRepo } from '@dataAccess'
import { NewModificationRequestPage } from '@views'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import routes from '@routes'
import { errorResponse, notFoundResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

const ACTIONS = ['actionnaire', 'puissance', 'recours']

v1Router.get(
  routes.DEMANDE_GENERIQUE,
  ensureRole(['porteur-projet', 'cre']),
  asyncHandler(async (request, response) => {
    const { action, projectId } = request.query as any

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    if (!ACTIONS.includes(action)) {
      return errorResponse({ request, response, customMessage: 'Le type de demande est erronné.' })
    }

    const project = await projectRepo.findById(projectId)

    if (!project) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const { appelOffreId, periodeId, familleId } = project
    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })
    if (!appelOffre) {
      return notFoundResponse({ request, response, ressourceTitle: 'AppelOffre' })
    }

    return response.send(
      NewModificationRequestPage({
        request,
        project,
        appelOffre,
      })
    )
  })
)
