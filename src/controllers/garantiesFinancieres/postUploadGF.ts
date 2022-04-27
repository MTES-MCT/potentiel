import asyncHandler from '../helpers/asyncHandler'
import fs from 'fs'
import { ensureRole } from '@config'
import { uploadGF } from '@config/useCases.config'
import { logger } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { pathExists } from '../../helpers/pathExists'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { upload } from '../upload'
import { v1Router } from '../v1Router'
import { GFCertificateHasAlreadyBeenSentError } from '../../modules/project'
import { parse, isDate } from 'date-fns'

v1Router.post(
  routes.UPLOAD_GARANTIES_FINANCIERES(),
  ensureRole(['porteur-projet']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    const { type, stepDate, projectId, expirationDate } = request.body

    if (!validateUniqueId(projectId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de le la transmission de votre attestation de garanties financières. Merci de recommencer.',
      })
    }

    if (type !== 'garanties-financieres') {
      return errorResponse({ request, response, customStatus: 400 })
    }

    if (!stepDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre attestation de garanties financières n'a pas pu être envoyée. La date est obligatoire.",
        })
      )
    }

    const parsedStepDate = isDate(stepDate) ? stepDate : parse(stepDate, 'yyyy-MM-dd', new Date())

    if (!isDate(parsedStepDate)) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre attestation de garanties financières n'a pas pu être envoyée. La date renseignée n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

    if (parsedStepDate.getTime() > new Date().getTime()) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre attestation de garanties financières n'a pas pu être envoyée. La date ne doit pas dépasser la date du jour",
        })
      )
    }

    if (!expirationDate) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre attestation de garanties financières n'a pas pu être envoyée. La date d'échéance est obligatoire.",
        })
      )
    }

    const parsedExpirationDate = isDate(expirationDate)
      ? expirationDate
      : parse(expirationDate, 'yyyy-MM-dd', new Date())

    if (!isDate(parsedExpirationDate)) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre attestation de garanties financières n'a pas pu être envoyée. La date d'échéance n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

    const attestationExists: boolean = !!request.file && (await pathExists(request.file.path))

    if (!attestationExists) {
      return response.redirect(
        addQueryParams(routes.PROJECT_DETAILS(projectId), {
          error:
            "Votre attestation de garanties financières n'a pas pu être envoyée. Merci d'attacher l'attestation en pièce-jointe.",
        })
      )
    }

    const file = {
      contents: fs.createReadStream(request.file!.path),
      filename: `${Date.now()}-${request.file!.originalname}`,
    }

    ;(
      await uploadGF({
        projectId,
        stepDate: parsedStepDate,
        expirationDate: parsedExpirationDate,
        file,
        submittedBy: request.user,
      })
    ).match(
      () =>
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Votre attestation de garanties financières a bien été enregistrée.',
            redirectUrl: routes.PROJECT_DETAILS(projectId),
            redirectTitle: 'Retourner à la page projet',
          })
        ),
      (e) => {
        if (e instanceof GFCertificateHasAlreadyBeenSentError) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(projectId), {
              error:
                "Il semblerait qu'il y ait déjà une garantie financière en cours de validité sur ce projet.",
            })
          )
        }

        if (e instanceof UnauthorizedError) {
          return unauthorizedResponse({ request, response })
        }

        logger.error(e)
        return errorResponse({ request, response })
      }
    )
  })
)
