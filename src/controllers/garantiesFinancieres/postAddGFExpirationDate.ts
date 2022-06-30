import asyncHandler from '../helpers/asyncHandler'
import { addGFExpirationDate, ensureRole } from '@config'
import { logger } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'
import {
  errorResponse,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
  RequestValidationErrorArray,
  iso8601DateToDateYupTransformation,
} from '../helpers'
import { v1Router } from '../v1Router'
import * as yup from 'yup'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  expirationDate: yup
    .date()
    .required("Vous devez renseigner la date d'échéance.")
    .transform(iso8601DateToDateYupTransformation)
    .typeError(`La date d'échéance saisie n'est pas valide.`),
})

v1Router.post(
  routes.ADD_GF_EXPIRATION_DATE(),
  ensureRole(['porteur-projet', 'dreal']),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { projectId, expirationDate } = body
        const { user: submittedBy } = request

        return addGFExpirationDate({ projectId, expirationDate, submittedBy }).map(() => ({
          projectId,
        }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: "La date d'échéance des garanties financières a bien été enregistrée.",
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error: Error) => {
          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(request.body.projectId), {
                ...request.body,
                error: `${error.message} ${error.errors.join(' ')}`,
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
              'Il y a eu une erreur lors de la soumission de votre demande. Veuillez nous contacter si le problème persiste.',
          })
        }
      )
  })
)
