import { ensureRole, getProjectAppelOffre } from '@config'
import { NewModificationRequestPage } from '@views'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import routes from '@routes'
import { errorResponse, notFoundResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import { Project } from '@infra/sequelize/projections'

const ACTIONS = ['actionnaire', 'puissance', 'recours']

v1Router.get(
  routes.DEMANDE_GENERIQUE,
  ensureRole('porteur-projet'),
  asyncHandler(async (request, response) => {
    const { action, projectId } = request.query as any

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    if (!ACTIONS.includes(action)) {
      return errorResponse({ request, response, customMessage: 'Le type de demande est erronné.' })
    }

    const project = await Project.findByPk(projectId)

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
        project: { ...project, unitePuissance: appelOffre.unitePuissance },
        appelOffre,
      })
    )
  })
)
