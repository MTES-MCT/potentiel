import fs from 'fs'
import { ensureRole, signalerDemandeRecours } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  RequestValidationError,
  unauthorizedResponse,
  validateRequestBody,
} from '../helpers'
import { v1Router } from '../v1Router'
import { upload } from '../upload'
import * as yup from 'yup'
import { addQueryParams } from '../../helpers/addQueryParams'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  decidedOn: yup
    .date()
    .required('Ce champ est obligatoire')
    .nullable()
    .transform(iso8601DateToDateYupTransformation)
    .typeError(`La date saisie n'est pas valide`),
  status: yup
    .mixed<'acceptée' | 'rejetée'>()
    .oneOf(['acceptée', 'rejetée'])
    .required('Ce champ est obligatoire')
    .typeError(`Le statut n'est pas valide`),
  notes: yup.string().optional(),
})

v1Router.post(
  routes.ADMIN_SIGNALER_DEMANDE_RECOURS_POST,
  upload.single('file'),
  ensureRole(['admin', 'dgec', 'dreal']),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { projectId, decidedOn, status, notes } = body
        const { user: signaledBy } = request

        const file = request.file && {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        }

        return signalerDemandeRecours({
          projectId,
          decidedOn,
          status,
          notes,
          file,
          signaledBy,
        }).map(() => ({ projectId }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre signalement de demande de recours a bien été enregistré.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof RequestValidationError) {
            return response.redirect(
              addQueryParams(routes.ADMIN_SIGNALER_DEMANDE_ABANDON_PAGE(request.body.projectId), {
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
