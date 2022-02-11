import { ensureRole, getCahiersChargesURLs } from '@config'
import { logger } from '@core/utils'
import { projectRepo } from '@dataAccess'
import { NewModificationRequestPage } from '@views'
import { getProjectAppelOffre } from '@config/queries.config'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import routes from '../../routes'
import { errorResponse, notFoundResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

const ACTIONS = [
  'delai',
  'actionnaire',
  'puissance',
  'producteur',
  'abandon',
  'recours',
  'fournisseur',
]

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

    const project = await projectRepo.findById(projectId)

    if (!project) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const { appelOffreId, periodeId, familleId } = project

    const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

    return await getCahiersChargesURLs(appelOffreId, periodeId).match(
      (cahiersChargesURLs) => {
        return response.send(
          NewModificationRequestPage({
            request,
            project: {
              ...project,
              ...(appelOffre && { appelOffre }),
            },
            cahiersChargesURLs,
          })
        )
      },
      (error) => {
        logger.error(error)
        return errorResponse({ request, response })
      }
    )
  })
)
