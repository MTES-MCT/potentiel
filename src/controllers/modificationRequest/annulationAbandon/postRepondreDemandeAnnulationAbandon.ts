import * as yup from 'yup'
import fs from 'fs'

import { ensureRole, rejeterDemandeAnnulationAbandon } from '@config'

import routes from '../../../routes'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { errAsync, logger } from '@core/utils'
import { errorResponse, RequestValidationErrorArray, unauthorizedResponse } from '../../helpers'
import { UnauthorizedError } from '@modules/shared'
import safeAsyncHandler from '../../helpers/safeAsyncHandler'
import { StatutIncompatiblePourRejeterDemandeAnnulationAbandonError } from '@modules/demandeModification/demandeAnnulationAbandon/rejeter'
const schema = yup.object({
  body: yup.object({
    submitAccept: yup.string().nullable(),
    submitRefuse: yup.string().nullable(),
    modificationRequestId: yup.string().uuid().required(),
  }),
})

v1Router.post(
  routes.POST_REPONDRE_DEMANDE_ANNULATION_ABANDON,
  ensureRole(['admin', 'dgec-validateur']),
  upload.single('file'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.DEMANDE_PAGE_DETAILS(request.body.modificationRequestId), {
            ...error.errors,
          })
        ),
    },
    async (request, response) => {
      const { modificationRequestId, submitAccept } = request.body
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
        return errorResponse({
          request,
          response,
          customMessage:
            'Il y a eu une erreur lors de la soumission de votre réponse. Merci de recommencer.',
        })
      }

      return rejeterDemandeAnnulationAbandon({
        user,
        demandeId: modificationRequestId,
        fichierRéponse,
      }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'La demande a bien été rejetée',
              redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
              redirectTitle: 'Retourner sur la page de la demande',
            })
          ),
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          if (error instanceof StatutIncompatiblePourRejeterDemandeAnnulationAbandonError) {
            return response.redirect(
              addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
                error: error.message,
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
    }
  )
)
