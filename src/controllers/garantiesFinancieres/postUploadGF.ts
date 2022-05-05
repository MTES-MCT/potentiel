import asyncHandler from '../helpers/asyncHandler'
import fs from 'fs'
import { ensureRole } from '@config'
import { uploadGF } from '@config/useCases.config'
import { logger, Result, ok, err } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { upload } from '../upload'
import { v1Router } from '../v1Router'
import {
  CertificateFileIsMissingError,
  GFCertificateHasAlreadyBeenSentError,
} from '../../modules/project'
import { format, parse } from 'date-fns'
import * as yup from 'yup'
import { ValidationError, BaseSchema, InferType } from 'yup'
import { pathExists } from '../../helpers/pathExists'

const parseStringDate = (value, originalValue) => {
  return parse(originalValue, 'yyyy-MM-dd', new Date())
}

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  stepDate: yup
    .date()
    .transform(parseStringDate)
    .max(
      format(new Date(), 'yyyy-MM-dd'),
      "La date de constitution ne doit dépasser la date d'aujourd'hui."
    )
    .required('Vous devez renseigner la date de constitution.')
    .typeError(`La date de constitution n'est pas valide.`),
  expirationDate: yup
    .date()
    .transform(parseStringDate)
    .required("Vous devez renseigner la date d'échéance.")
    .typeError(`La date d'échéance saisie n'est pas valide.`),
  type: yup.mixed().oneOf(['garanties-financieres']).required('Ce champ est obligatoire.'),
})
class RequestValidationError extends Error {
  constructor(public errors: Array<string>) {
    super("L'attestation de constitution des garanties financières n'a pas pu être envoyée.")
  }
}

const validateRequestBody = (
  body: Request['body'],
  schema: BaseSchema
): Result<InferType<typeof schema>, RequestValidationError | Error> => {
  try {
    return ok(schema.validateSync(body, { abortEarly: false }))
  } catch (error) {
    if (error instanceof ValidationError) {
      return err(new RequestValidationError(error.errors))
    }
    return err(error)
  }
}

v1Router.post(
  routes.UPLOAD_GARANTIES_FINANCIERES(),
  ensureRole(['porteur-projet', 'dreal']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .andThen((body) => {
        if (!request.file || !pathExists(request.file.path)) {
          return err(new CertificateFileIsMissingError())
        }
        return ok(body)
      })
      .asyncAndThen((body) => {
        const { stepDate, projectId, expirationDate } = body
        const { user: submittedBy } = request
        const file = {
          contents: fs.createReadStream(request.file!.path),
          filename: `${Date.now()}-${request.file!.originalname}`,
        }

        return uploadGF({ projectId, stepDate, expirationDate, file, submittedBy }).map(() => ({
          projectId,
        }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre attestation de garanties financières a bien été enregistrée.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof RequestValidationError) {
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
                error:
                  "L'attestation de constitution des garanties financières n'a pas pu être envoyée. Vous devez joindre un fichier.",
              })
            )
          }

          if (error instanceof GFCertificateHasAlreadyBeenSentError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
                error:
                  "Il semblerait qu'il y ait déjà une garantie financière en cours de validité sur ce projet.",
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
