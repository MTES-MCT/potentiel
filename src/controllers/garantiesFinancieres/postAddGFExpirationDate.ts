import asyncHandler from '../helpers/asyncHandler'
import { addGFExpirationDate, ensureRole } from '@config'
import { logger, Result, ok, err } from '@core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import { parse } from 'date-fns'
import * as yup from 'yup'
import { ValidationError, BaseSchema, InferType } from 'yup'

const parseStringDate = (value, originalValue) => {
  return parse(originalValue, 'yyyy-MM-dd', new Date())
}

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  expirationDate: yup
    .date()
    .required("Vous devez renseigner la date d'échéance.")
    .transform(parseStringDate)
    .typeError(`La date d'échéance saisie n'est pas valide.`),
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
  routes.ADD_GF_EXPIRATION_DATE(),
  ensureRole(['porteur-projet', 'dreal']),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
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
          if (error instanceof RequestValidationError) {
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
