import { ensureRole } from '@config'
import asyncHandler from '../helpers/asyncHandler'
import { getCahiersChargesURLs } from '@config/queries.config'
import { shouldUserAccessProject } from '@config/useCases.config'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { EntityNotFoundError } from '@modules/shared'
import routes from '@routes'
import { ChoisirCahierDesChargesPage } from '@views'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import { err } from '../../core/utils'
import { getProjectDataForChoisirCDCPage } from '@infra/sequelize/queries/project/getProjectDataForChoisirCDCPage'

v1Router.get(
  routes.CHOISIR_CAHIER_DES_CHARGES(),
  ensureRole(['porteur-projet']),
  asyncHandler(async (request, response) => {
    const { projetId } = request.params
    const { user } = request

    if (!validateUniqueId(projetId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const userHasRightsToProject = await shouldUserAccessProject.check({
      user,
      projectId: projetId,
    })

    if (!userHasRightsToProject) {
      return unauthorizedResponse({
        request,
        response,
        customMessage: `Votre compte ne vous permet pas d'accéder à ce projet.`,
      })
    }

    await getProjectDataForChoisirCDCPage({ projectId: projetId })
      .andThen((project) => {
        if (!project.isClasse || !project?.appelOffre?.choisirNouveauCahierDesCharges) {
          return err(new EntityNotFoundError())
        }

        const { appelOffreId, periodeId } = project
        return getCahiersChargesURLs(appelOffreId, periodeId).map((cahiersChargesURLs) => ({
          cahiersChargesURLs,
          project,
        }))
      })
      .match(
        ({ cahiersChargesURLs, project }) => {
          return response.send(
            ChoisirCahierDesChargesPage({
              request,
              projet: project,
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
  })
)
