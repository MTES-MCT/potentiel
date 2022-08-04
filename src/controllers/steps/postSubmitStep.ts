import fs from 'fs'
import { format } from 'date-fns'
import * as yup from 'yup'

import { ensureRole } from '@config'
import { submitDCR, submitPTF } from '@config/useCases.config'
import routes from '@routes'
import { UnauthorizedError } from '@modules/shared'
import { logger, ok, err } from '@core/utils'
import {
  CertificateFileIsMissingError,
  DCRCertificatDéjàEnvoyéError,
  PTFCertificatDéjàEnvoyéError,
} from '@modules/project'

import asyncHandler from '../helpers/asyncHandler'
import { addQueryParams } from '../../helpers/addQueryParams'
import { pathExists } from '../../helpers/pathExists'

import {
  errorResponse,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
  RequestValidationErrorArray,
  iso8601DateToDateYupTransformation,
} from '../helpers'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  stepDate: yup
    .date()
    .transform(iso8601DateToDateYupTransformation)
    .max(format(new Date(), 'yyyy-MM-dd'), "La date ne doit dépasser la date d'aujourd'hui.")
    .required('Vous devez renseigner une date.')
    .typeError(`La date n'est pas valide.`),
  type: yup.mixed().oneOf(['ptf', 'dcr']).required('Ce champ est obligatoire.'),
  numeroDossier: yup.string().when('type', {
    is: (type) => type === 'dcr',
    then: yup
      .string()
      .required('Vous devez renseigner le numéro de dossier.')
      .typeError("Le numéro de dossier saisi n'est pas valide"),
    otherwise: yup.string().optional().typeError("Le numéro de dossier saisi n'est pas valide"),
  }),
})

v1Router.post(
  routes.DEPOSER_ETAPE_ACTION,
  ensureRole(['porteur-projet']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .andThen((body) => {
        if (!request.file || !pathExists(request.file.path)) {
          return err(new CertificateFileIsMissingError())
        }
        return ok(body)
      })
      .asyncAndThen((body) => {
        const { projectId, stepDate, numeroDossier, type } = body
        const { user: submittedBy } = request
        const file = {
          contents: fs.createReadStream(request.file!.path),
          filename: `${Date.now()}-${request.file!.originalname}`,
        }

        if (type === 'dcr') {
          return submitDCR({
            type,
            projectId,
            stepDate,
            file,
            submittedBy,
            numeroDossier: numeroDossier as string,
          }).map(() => ({
            projectId,
          }))
        }

        return submitPTF({ type, projectId, stepDate, file, submittedBy }).map(() => ({
          projectId,
        }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre dépôt a bien été enregistré.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          const { projectId } = request.body

          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(projectId), {
                ...request.body,
                error: `${error.message} ${error.errors.join(' ')}`,
              })
            )
          }

          if (error instanceof CertificateFileIsMissingError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(projectId), {
                error: "Le dépôt n'a pas pu être envoyée. Vous devez joindre un fichier.",
              })
            )
          }

          if (error instanceof DCRCertificatDéjàEnvoyéError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(projectId), {
                error:
                  "Il semblerait qu'il y ait déjà une demande complète de raccordement en cours de validité sur ce projet.",
              })
            )
          }

          if (error instanceof PTFCertificatDéjàEnvoyéError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(projectId), {
                error:
                  "Il semblerait qu'il y ait déjà une proposition technique et financière en cours de validité sur ce projet.",
              })
            )
          }

          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          logger.error(error)

          return errorResponse({
            request,
            response,
            customMessage:
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          })
        }
      )
  })
)
