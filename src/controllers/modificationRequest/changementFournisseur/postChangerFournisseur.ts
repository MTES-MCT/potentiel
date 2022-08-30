import fs from 'fs'
import omit from 'lodash/omit'
import * as yup from 'yup'

import { ensureRole, requestProducteurModification } from '@config'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'

import { addQueryParams } from '../../../helpers/addQueryParams'
import {
  errorResponse,
  RequestValidationErrorArray,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
} from '../../helpers'
import asyncHandler from '../../helpers/asyncHandler'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  newRulesOptIn: yup.boolean().optional(),
  producteur: yup.string().required('Le champ producteur est obligatoire.'),
  email: yup.string().email().optional(),
  justification: yup.string().optional(),
})

v1Router.post(
  routes.CHANGEMENT_PRODUCTEUR_ACTION,
  upload.single('file'),
  ensureRole('porteur-projet'),
  asyncHandler((request, response) =>
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { projectId, newRulesOptIn, producteur, email, justification } = body
        const { user } = request

        const file = request.file && {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        }

        return requestProducteurModification({
          requestedBy: user,
          projectId,
          ...(newRulesOptIn && { newRulesOptIn: true }),
          file,
          justification,
          newProducteur: producteur,
          email,
        }).map(() => ({ projectId }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre changement de producteur a bien été enregistré.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.DEMANDER_DELAI(request.body.projectId), {
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
  )
)
