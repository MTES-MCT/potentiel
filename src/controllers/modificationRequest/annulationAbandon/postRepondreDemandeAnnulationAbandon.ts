import * as yup from 'yup'
import fs from 'fs'
import { ensureRole, rejeterDemandeAnnulationAbandon } from '@config'
import { errAsync, logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'

import {
  errorResponse,
  RequestValidationErrorArray,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
} from '../../helpers'
import routes from '../../../routes'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import asyncHandler from '../../helpers/asyncHandler'

import { addQueryParams } from '../../../helpers/addQueryParams'

const schema = yup.object({
  submitAccept: yup.string().nullable(),
  submitRefuse: yup.string().nullable(),
  modificationRequestId: yup.string().uuid().required(),
})

const SUCCESS_MESSAGES = {
  accorder: 'La demande a bien été accordée',
  rejeter: 'La demande a bien été rejetée',
}

v1Router.post(
  routes.POST_REPONDRE_DEMANDE_ANNULATION_ABANDON,
  ensureRole(['admin', 'dgec-validateur']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, schema)
      .asyncAndThen((body) => {
        const { modificationRequestId, submitAccept } = body
        const { user, file } = request

        if (!file) {
          return errAsync(
            new RequestValidationErrorArray([
              "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
            ])
          )
        }

        const fichierRéponse = {
          contents: fs.createReadStream(file.path),
          filename: `${Date.now()}-${file.originalname}`,
        }

        const estAccordé = typeof submitAccept === 'string'

        if (estAccordé) {
          // use-case à rajouter
        }

        return rejeterDemandeAnnulationAbandon({
          user,
          demandeId: modificationRequestId,
          fichierRéponse,
        }).map(() => ({ modificationRequestId, action: 'rejeter' }))
      })
      .match(
        ({ modificationRequestId, action }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: SUCCESS_MESSAGES[action],
              redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
              redirectTitle: 'Retourner sur la page de la demande',
            })
          )
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.DEMANDE_PAGE_DETAILS(request.body.modificationRequestId), {
                error: `${error.message} ${error.errors.join(' ')}`,
              })
            )
          }

          logger.error(error)
          return errorResponse({
            request,
            response,
            customMessage:
              'Il y a eu une erreur lors de la soumission de votre réponse. Merci de recommencer.',
          })
        }
      )
  })
)
