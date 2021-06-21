import { projectRepo } from '../../dataAccess'
import { addQueryParams } from '../../helpers/addQueryParams'
import { NewModificationRequestPage } from '../../views/pages'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { getPeriodeList } from '../../config'
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

    let cahierChargesURL

    await getPeriodeList().match(
      (periodes) => {
        const periode = periodes.find(
          ({ periodeId, appelOffreId }) => appelOffreId === project?.appelOffre?.id && periodeId === project.appelOffre.periode.id
        )

        cahierChargesURL = periode?.['Lien du cahier des charges']

        return
      }, async (error) => {
        logger.error(error)
        response.status(500).send("Impossible d'obtenir la liste des périodes")
        return
      }
    )

    return project
      ? response.send(
          NewModificationRequestPage({
            request,
            project,
            cahierChargesURL
          })
        )
      : response.redirect(
          addQueryParams(routes.USER_DASHBOARD, {
            error: "Le projet demandé n'existe pas",
          })
        )
  })
)
