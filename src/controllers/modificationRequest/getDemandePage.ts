import { projectRepo } from '../../dataAccess'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { ensureRole } from '../../config'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { getCahiersChargesURLs } from '../../config'
import { logger } from '../../core/utils'
import { NewModificationRequestPage } from '../../views'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse } from '../helpers'

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

    const { appelOffreId, periodeId } = project

    return await getCahiersChargesURLs(appelOffreId, periodeId).match(
      (cahiersChargesURLs) => {
        return response.send(
          NewModificationRequestPage({
            request,
            project,
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
