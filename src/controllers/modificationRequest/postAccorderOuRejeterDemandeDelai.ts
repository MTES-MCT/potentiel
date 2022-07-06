import fs from 'fs'
import * as yup from 'yup'

import { accorderDemandeDélai, ensureRole, rejeterDemandeDélai } from '@config'
import { logger, errAsync, err } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import { AccorderDateAchèvementAntérieureDateThéoriqueError } from '@modules/demandeModification/demandeDélai/accorder'

import asyncHandler from '../helpers/asyncHandler'
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  RequestValidationErrorArray,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
} from '../helpers'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

const requestBodySchema = yup.object({
  submitAccept: yup.string().nullable(),
  submitRefuse: yup.string().nullable(),
  modificationRequestId: yup.string().uuid().required(),
  dateAchèvementAccordée: yup.date().when('submitAccept', {
    is: (submitAccept) => typeof submitAccept === 'string',
    then: yup
      .date()
      .required('Ce champ est obligatoire')
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date saisie n'est pas valide`),
  }),
})

v1Router.post(
  routes.ADMIN_ACCORDER_OU_REJETER_DEMANDE_DELAI,
  ensureRole(['admin', 'dgec', 'dreal']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { modificationRequestId, dateAchèvementAccordée, submitAccept, submitRefuse } = body
        const { user } = request

        if (!request.file) {
          return errAsync(
            new RequestValidationErrorArray([
              "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
            ])
          )
        }

        const file = request.file && {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        }

        const estAccordé = typeof submitAccept === 'string'
        const estRejeté = typeof submitRefuse === 'string'

        if (estRejeté) {
          return rejeterDemandeDélai({
            user,
            demandeDélaiId: modificationRequestId,
            fichierRéponse: file,
          }).map(() => ({ modificationRequestId, estAccordé: false }))
        }

        if (estAccordé && dateAchèvementAccordée) {
          const résultat = accorderDemandeDélai({
            user,
            demandeDélaiId: modificationRequestId,
            dateAchèvementAccordée,
            fichierRéponse: file,
          }).map(() => ({ modificationRequestId, estAccordé }))
          return résultat
        }

        return errAsync(new Error('Réponse incorrecte'))
      })
      .match(
        ({ modificationRequestId, estAccordé }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `La demande de délai a bien été ${estAccordé ? 'accordée' : 'rejetée'}.`,
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

          if (error instanceof AccorderDateAchèvementAntérieureDateThéoriqueError) {
            return errorResponse({
              request,
              response,
              customStatus: 400,
              customMessage: error.message,
            })
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
