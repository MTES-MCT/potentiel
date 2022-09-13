import fs from 'fs'
import * as yup from 'yup'

import { choisirNouveauCahierDesCharges, demanderAbandon, ensureRole } from '@config'
import { logger, okAsync } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'

import { addQueryParams } from '../../../helpers/addQueryParams'
import {
  errorResponse,
  RequestValidationError,
  unauthorizedResponse,
  validateRequestBody,
} from '../../helpers'
import asyncHandler from '../../helpers/asyncHandler'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  justification: yup.string().optional(),
  numeroGestionnaire: yup.string().optional(),
  nouvellesRèglesDInstructionChoisies: yup.boolean().optional(),
})

v1Router.post(
  routes.DEMANDE_ABANDON_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBody(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request

        const file = request.file && {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        }

        if (body.nouvellesRèglesDInstructionChoisies) {
          return choisirNouveauCahierDesCharges({
            projetId: body.projectId,
            utilisateur: user,
          }).map(() => ({ file, user, ...body }))
        }

        return okAsync({ file, user, ...body })
      })
      .andThen(({ file, user, ...body }) => {
        const { projectId, justification } = body
        return demanderAbandon({
          user,
          projectId,
          file,
          justification,
        }).map(() => ({ projectId }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Votre demande d'abandon a bien été envoyée.`,
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof RequestValidationError) {
            return response.redirect(
              addQueryParams(routes.DEMANDER_DELAI(request.body.projectId), {
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
