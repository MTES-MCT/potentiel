import { projectRepo } from '../../dataAccess'
import { addQueryParams } from '../../helpers/addQueryParams'
import { NewModificationRequestPage } from '../../views/legacy-pages'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { getCahiersChargesURLs } from '../../config'
import { logger } from '../../core/utils'

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
  ensureLoggedIn(),
  ensureRole('porteur-projet'),
  asyncHandler(async (request, response) => {
    const { action, projectId } = request.query as any

    if (!projectId || !ACTIONS.includes(action)) {
      return response.redirect(routes.USER_DASHBOARD)
    }

    const project = await projectRepo.findById(projectId)

    if (!project)
      return response.redirect(
        addQueryParams(routes.USER_DASHBOARD, {
          error: "Le projet demandé n'existe pas",
        })
      )

    const { appelOffreId, periodeId } = project

    return await getCahiersChargesURLs(appelOffreId, periodeId).match(
      (cahiersChargesURLs) => {
        response.send(
          NewModificationRequestPage({
            request,
            project,
            cahiersChargesURLs,
          })
        )
        return
      },
      async (error) => {
        logger.error(error)
        return
      }
    )
  })
)
