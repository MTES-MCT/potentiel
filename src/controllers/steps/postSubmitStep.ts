import asyncHandler from '../helpers/asyncHandler'
import fs from 'fs'
import { ensureRole } from '@config'
import { submitStep } from '@config/useCases.config'
import { addQueryParams } from '../../helpers/addQueryParams'
import { pathExists } from '../../helpers/pathExists'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import {
  errorResponse,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
  RequestValidationErrorArray,
  iso8601DateToDateYupTransformation,
} from '../helpers'
import { upload } from '../upload'
import { v1Router } from '../v1Router'
import { format } from 'date-fns'
import * as yup from 'yup'
import { logger, ok, err } from '@core/utils'
import { CertificateFileIsMissingError } from '@modules/project'

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

        return submitStep({ type, projectId, stepDate, file, submittedBy, numeroDossier }).map(
          () => ({
            projectId,
          })
        )
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
          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
                ...request.body,
                error: `${error.message} ${error.errors.join(' ')}`,
              })
            )
          }

          if (error instanceof CertificateFileIsMissingError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
                error: "Le dépôt n'a pas pu être envoyée. Vous devez joindre un fichier.",
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
