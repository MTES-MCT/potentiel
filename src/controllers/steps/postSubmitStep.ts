import asyncHandler from 'express-async-handler'
import fs from 'fs'
import moment from 'moment'
import { ensureRole } from '../../config'
import { submitStep } from '../../config/useCases.config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { pathExists } from '../../helpers/pathExists'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.DEPOSER_ETAPE_ACTION,
  ensureRole(['admin', 'dgec', 'dreal', 'porteur-projet']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    const { type, stepDate, projectId, numeroDossier } = request.body

    if (!validateUniqueId(projectId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      })
    }

    if (!['ptf', 'dcr', 'garantie-financiere'].includes(type)) {
      return errorResponse({ request, response, customStatus: 400 })
    }

    if (!stepDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error: "Votre dépôt n'a pas pu être transmis. La date est obligatoire.",
        })
      )
    }

    if (!isDateFormatValid(stepDate)) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre dépôt n'a pas pu être transmis. La date envoyée n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

    const attestationExists: boolean = !!request.file && (await pathExists(request.file.path))

    if (!attestationExists) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre dépôt n'a pas pu être transmis. Merci d'attacher l'attestation en pièce-jointe.",
        })
      )
    }

    const file = {
      contents: fs.createReadStream(request.file!.path),
      filename: `${Date.now()}-${request.file!.originalname}`,
    }

    ;(
      await submitStep({
        type,
        projectId,
        stepDate: moment(stepDate, 'DD/MM/YYYY').toDate(),
        file,
        numeroDossier,
        submittedBy: request.user,
      })
    ).match(
      () =>
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Votre dépôt a bien été enregistré.',
            redirectUrl: routes.PROJECT_DETAILS(projectId),
            redirectTitle: 'Retourner à la page projet',
          })
        ),
      (e) => {
        if (e instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response })
        }

        logger.error(e)
        return errorResponse({ request, response })
      }
    )
  })
)

function isDateFormatValid(dateStr: string) {
  return moment(dateStr, 'DD/MM/YYYY').isValid()
}
