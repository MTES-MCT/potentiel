import { demanderDélai, ensureRole } from '@config'
import routes from '../../routes'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'
import {
  errorResponse,
  RequestValidationErrorArray,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
} from '../helpers'
import * as yup from 'yup'
import { iso8601DateToDateYupTransformation } from '../helpers'
import { upload } from '../upload'
import fs from 'fs'
import { addQueryParams } from '../../helpers/addQueryParams'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import omit from 'lodash/omit'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  dateAchèvementDemandée: yup
    .date()
    .required(`Vous devez renseigner la date d'achèvement souhaitée.`)
    .nullable()
    .transform(iso8601DateToDateYupTransformation)
    .typeError(`La date d'achèvement souhaitée saisie n'est pas valide`),
  justification: yup.string().optional(),
  numeroGestionnaire: yup.string().optional(),
})

v1Router.post(
  routes.DEMANDE_DELAI_ACTION,
  upload.single('file'),
  ensureRole('porteur-projet'),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
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
          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.DEMANDE_DELAIS(request.body.projectId), {
                ...omit(request.body, 'projectId'),
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
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          })
        }
      )
  })
)
