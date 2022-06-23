import { demanderDélai, ensureRole } from '@config'
import routes from '../../routes'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import {
  errorResponse,
  RequestValidationError,
  unauthorizedResponse,
  validateRequestBody,
} from '../helpers'
import * as yup from 'yup'
import { iso8601DateToDateYupTransformation } from '../helpers'
import { upload } from '../upload'
import fs from 'fs'
import { addQueryParams } from '../../helpers/addQueryParams'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  dateAchèvementDemandée: yup
    .date()
    .required('Ce champ est obligatoire')
    .nullable()
    .transform(iso8601DateToDateYupTransformation)
    .typeError(`La date saisie n'est pas valide`),
  justification: yup.string().optional(),
  numeroGestionnaire: yup.string().optional(),
})

v1Router.post(
  routes.DEMANDE_DELAI_ACTION,
  upload.single('file'),
  ensureRole('porteur-projet'),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { projectId, dateAchèvementDemandée, justification, numeroGestionnaire } = body
        const { user } = request

        const file = request.file && {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        }

        console.log('user id', user.id)

        return demanderDélai({
          user,
          projectId,
          file,
          justification,
          numeroGestionnaire,
          dateAchèvementDemandée,
        }).map(() => ({ projectId }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre demande de délai a bien été envoyée.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof RequestValidationError) {
            return response.redirect(
              addQueryParams(routes.DEMANDE_DELAIS(request.body.projectId), {
                ...request.body,
                ...error.errors,
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
