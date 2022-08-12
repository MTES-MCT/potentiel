import { ensureRole, eventStore } from '@config'
import { logger } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { FileDetachedFromProject } from '../../modules/file/events/FileDetachedFromProject'
import routes from '@routes'
import { errorResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.RETIRER_FICHIER_DU_PROJET_ACTION,
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const { attachmentId, projectId } = request.body

    if (!validateUniqueId(attachmentId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      })
    }

    return eventStore
      .publish(
        new FileDetachedFromProject({
          payload: {
            attachmentId,
            detachedBy: request.user.id,
          },
        })
      )
      .match(
        () => {
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Le fichier a bien été retiré du projet.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (e) => {
          logger.error(e as Error)

          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error: "Votre demande n'a pas pu être prise en compte.",
              ...request.body,
            })
          )
        }
      )
  })
)
