import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { toProjectDataForCertificate, ProjectProps } from '@modules/project'
import { IncompleteDataError } from '@modules/shared'
import routes from '../../routes'
import { v1Router } from '../v1Router'
import { ensureRole } from '@config'
import { getUserProject } from '@useCases'
import { buildCertificate } from '@views/certificates'
import asyncHandler from '../helpers/asyncHandler'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse } from '../helpers'

v1Router.get(
  routes.PREVIEW_CANDIDATE_CERTIFICATE(),
  ensureRole(['admin', 'dgec']),
  asyncHandler(async (request, response) => {
    const { projectId } = request.params

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    // Verify that the current user has the rights to check this out
    const project = await getUserProject({ user: request.user, projectId })

    if (!project) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const periode = project.appelOffre?.periode

    if (!periode || !periode.isNotifiedOnPotentiel || !periode.certificateTemplate) {
      logger.error(new Error("Impossible de trouver le modèle d'attestation pour ce projet"))
      return errorResponse({
        request,
        response,
        customMessage: "Impossible de trouver le modèle d'attestation pour ce projet",
      })
    }

    const { certificateTemplate } = periode

    await toProjectDataForCertificate({
      appelOffre: project.appelOffre,
      isClasse: project.classe === 'Classé',
      notifiedOn: Date.now(),
      projectId: new UniqueEntityID(project.id),
      data: project as unknown,
      potentielIdentifier: project.potentielIdentifier,
    } as ProjectProps)
      .asyncAndThen((data) =>
        buildCertificate({
          template: certificateTemplate,
          data,
        })
      )
      .match(
        (certificateStream) => {
          response.type('pdf')
          certificateStream.pipe(response)
          return response.status(200)
        },
        (e: Error) => {
          logger.error(e)

          if (e instanceof IncompleteDataError) {
            return errorResponse({
              request,
              response,
              customStatus: 400,
              customMessage: "Impossible de générer l'attestion parce qu'il manque des données.",
            })
          } else {
            return errorResponse({
              request,
              response,
            })
          }
        }
      )
  })
)
